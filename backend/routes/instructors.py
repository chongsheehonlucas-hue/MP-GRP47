import sqlite3
from pathlib import Path

from fastapi import APIRouter, HTTPException, Request

router = APIRouter()

# Finding the backend directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Define the database locations
DB_PATH = BASE_DIR / "student_analysis.db"
AUTH_DB_PATH = BASE_DIR / "forensics.db"


@router.get("/instructor/analytics")
def get_student_analysis(request: Request):
    # Check the existing login session
    user_id = request.session.get("user_id")

    if user_id is None:
        raise HTTPException(401, "Please log in.")

    conn = sqlite3.connect(AUTH_DB_PATH)

    try:
        user = conn.execute(
            "SELECT role FROM users WHERE user_id = ?",
            (user_id,)
        ).fetchone()

    finally:
        conn.close()

    if user is None or user[0] != "instructor":
        raise HTTPException(403, "Instructor access required.")

    # Read the student analysis database
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    try:
        learners = conn.execute(
            "SELECT * FROM learners ORDER BY learner_id"
        ).fetchall()

        modules = conn.execute(
            "SELECT * FROM modules ORDER BY module_id"
        ).fetchall()

        # Get the latest assessment for each learner and module
        scores = conn.execute("""
            SELECT a.*
            FROM assessment_attempts a
            WHERE a.attempt_id = (
                SELECT attempt_id
                FROM assessment_attempts
                WHERE learner_id = a.learner_id
                  AND module_id = a.module_id
                ORDER BY submitted_at DESC, attempt_id DESC
                LIMIT 1
            )
        """).fetchall()

    finally:
        conn.close()

    students = []

    for learner in learners:
        results = [
            {
                "module_id": score["module_id"],
                "points_earned": score["points_earned"],
                "points_possible": score["points_possible"],
                "percentage": round(
                    score["points_earned"]
                    / score["points_possible"] * 100, 1
                )
            }
            for score in scores
            if score["learner_id"] == learner["learner_id"]
        ]

        average = (
            round(
                sum(result["percentage"] for result in results)
                / len(results), 1
            )
            if results else None
        )

        students.append({
            **dict(learner),
            "results": results,
            "average": average,
            "assessed": len(results)
        })

    module_results = []

    for module in modules:
        percentages = [
            result["percentage"]
            for student in students
            for result in student["results"]
            if result["module_id"] == module["module_id"]
        ]

        module_results.append({
            **dict(module),
            "average": (
                round(sum(percentages) / len(percentages), 1)
                if percentages else None
            ),
            "assessed": len(percentages)
        })

    averages = [
        student["average"]
        for student in students
        if student["average"] is not None
    ]

    return {
        "total_students": len(students),
        "average_score": (
            round(sum(averages) / len(averages), 1)
            if averages else None
        ),
        "modules": module_results,
        "students": students
    }