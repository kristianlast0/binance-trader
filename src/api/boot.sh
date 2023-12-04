#!/usr/bin/env bash
exec gunicorn -b :5000 --log-level debug --access-logfile - --error-logfile - main:app --timeout 0