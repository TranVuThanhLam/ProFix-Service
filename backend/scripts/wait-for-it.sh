#!/bin/bash
# wait-for-it.sh: Wait for a service to be available before running a command.

# Exit on error
set -e

# Check if service is up
host=$1
shift
port=$1
shift
cmd="$@"

until nc -z -v -w30 $host $port
do
  echo "Waiting for $host:$port to be available..."
  sleep 5
done

echo "$host:$port is up - executing command"
exec $cmd
