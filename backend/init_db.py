import sqlite3
from pathlib import Path

# Find the backend directory
BASE_DIR = Path(__file__).resolve().parent

# Define the database and SQL file locations
DB_PATH = BASE_DIR / "forensics.db"
SQL_PATH = BASE_DIR / "schema.sql"

# Open a connection to the SQLite database
conn = sqlite3.connect(DB_PATH)

try:
    # Read and execute the SQL script
    sql_script = SQL_PATH.read_text(encoding="utf-8")
    conn.executescript(sql_script)

    # Save changes
    conn.commit()

    # Display the created table columns
    columns = conn.execute(
        "PRAGMA table_info(users)"
    ).fetchall()

    print("Database initialised successfully!")
    print("Users table columns:")

    for column in columns:
        print(column[1])

finally:
    conn.close()
