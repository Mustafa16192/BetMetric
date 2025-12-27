FROM python:3.11

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sSL https://install.python-poetry.org | python - 

ENV PATH="/root/.poetry/bin:$PATH"

# Copy ONLY dependency definition files first (to cache dependencies)
# We assume build context is repo root.
COPY backend/pyproject.toml backend/poetry.lock /app/

# Install dependencies
RUN poetry install --no-root --no-interaction --no-ansi

# Copy the ENTIRE backend directory into /app
# This ensures we get 'app', 'alembic', 'alembic.ini' etc.
# Docker 'COPY src dest' copies contents of src into dest.
COPY backend /app

# Command to run the application
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
