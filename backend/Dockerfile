FROM python:3.11

# Set the working directory for the application inside the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python - 

# Add Poetry to PATH
ENV PATH="/root/.poetry/bin:$PATH"

# Copy poetry project files - Adjusted to be relative to repo root
# This assumes Railway's build context is the root of your git repository
COPY backend/pyproject.toml /app/pyproject.toml
COPY backend/poetry.lock /app/poetry.lock

# Install dependencies using Poetry (pyproject.toml and poetry.lock are now in /app)
RUN poetry install --no-root --no-interaction --no-ansi

# Copy the rest of the application files - Adjusted to be relative to repo root
# This copies the 'app' directory from 'backend/app' to '/app'
COPY backend/app /app

# Command to run the application
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]