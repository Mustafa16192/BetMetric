FROM python:3.11

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sSL https://install.python-poetry.org | python - 

ENV PATH="/root/.poetry/bin:$PATH"

# Copy files from the build context root.
# On Railway, ensure 'Root Directory' is set to 'backend' so this finds pyproject.toml
COPY pyproject.toml poetry.lock ./

RUN poetry install --no-root --no-interaction --no-ansi

# Copy the rest of the application code
COPY . .

CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]