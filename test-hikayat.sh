#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# hikayat-js manual test script
# Run the server (or `docker compose up`) first, then run this script.
# ---------------------------------------------------------------------------

BASE_URL="http://localhost:3000"

echo "=== Basic connectivity ==="
curl -s "$BASE_URL/notes"; echo

echo ""
echo "=== CRUD: create a plain note ==="
curl -s -X POST "$BASE_URL/notes" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test note", "content": "Hello world"}'; echo

echo ""
echo "=== CRUD: list all notes ==="
curl -s "$BASE_URL/notes"; echo

echo ""
echo "=== CRUD: get note by id ==="
curl -s "$BASE_URL/notes/1"; echo

echo ""
echo "=== CRUD: get non-existent note (expect 404) ==="
curl -s -o /dev/null -w "Status: %{http_code}\n" "$BASE_URL/notes/999"

echo ""
echo "=== CRUD: update note by id ==="
curl -s -X PUT "$BASE_URL/notes/1" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","content":"New content"}'; echo

echo ""
echo "=== CRUD: delete note by id (expect 204) ==="
curl -s -o /dev/null -w "Status: %{http_code}\n" -X DELETE "$BASE_URL/notes/1"

echo ""
echo "=== CRUD: confirm deletion (expect 404) ==="
curl -s -o /dev/null -w "Status: %{http_code}\n" "$BASE_URL/notes/1"

echo ""
echo "=== Validation: missing/empty title and content (expect 422) ==="
curl -s -w "\nStatus: %{http_code}\n" -X POST "$BASE_URL/notes" \
  -H "Content-Type: application/json" \
  -d '{"title": ""}'

echo ""
echo "=== Validation: malformed JSON (expect 400) ==="
curl -s -w "\nStatus: %{http_code}\n" -X POST "$BASE_URL/notes" \
  -H "Content-Type: application/json" \
  -d 'not json'

echo ""
echo "=== Validation: valid plain note (expect 201) ==="
curl -s -w "\nStatus: %{http_code}\n" -X POST "$BASE_URL/notes" \
  -H "Content-Type: application/json" \
  -d '{"title": "Valid", "content": "Valid content"}'

echo ""
echo "=== Search/filter: create note with tags (mixed case, duplicate) ==="
curl -s -X POST "$BASE_URL/notes" \
  -H "Content-Type: application/json" \
  -d '{"title":"Groceries","content":"Milk, eggs","tags":["Home","home","Shopping"]}'; echo

echo ""
echo "=== Search/filter: query by text (?q=) ==="
curl -s "$BASE_URL/notes?q=test"; echo

echo ""
echo "=== Search/filter: query by tag (?tag=) ==="
curl -s "$BASE_URL/notes?tag=shopping"; echo

echo ""
echo "=== Tags: add a tag to an existing note ==="
curl -s -X POST "$BASE_URL/notes/1/tags" \
  -H "Content-Type: application/json" \
  -d '{"tag":"urgent"}'; echo

echo ""
echo "=== Rate limiting: hammer the search endpoint (6 requests, expect 429 on 6th) ==="
for i in $(seq 1 6); do
  curl -s -o /dev/null -w "Request $i -> Status: %{http_code}\n" "$BASE_URL/notes?q=test"
done

echo ""
echo "=== OOP/Classes: create a checklist note (expect 201) ==="
curl -s -X POST "$BASE_URL/notes" \
  -H "Content-Type: application/json" \
  -d '{"title":"Groceries","type":"checklist","items":[{"text":"Milk"},{"text":"Eggs","done":true}]}'; echo

echo ""
echo "=== OOP/Classes: reject checklist with no items (expect 422) ==="
curl -s -w "\nStatus: %{http_code}\n" -X POST "$BASE_URL/notes" \
  -H "Content-Type: application/json" \
  -d '{"title":"Bad checklist","type":"checklist","items":[]}'

echo ""
echo "=== OOP/Classes: list notes and confirm checklist serializes with summary ==="
curl -s "$BASE_URL/notes"; echo

echo ""
echo "=== Update validation: reject changing note type via PUT (expect 422) ==="
curl -s -w "\nStatus: %{http_code}\n" -X PUT "$BASE_URL/notes/1" \
  -H "Content-Type: application/json" \
  -d '{"title":"Trying to convert","type":"checklist","items":[{"text":"x"}]}'

echo ""
echo "=== Batch import: mixed valid/invalid notes (expect 207, partial success) ==="
curl -s -w "\nStatus: %{http_code}\n" -X POST "$BASE_URL/notes/batch" \
  -H "Content-Type: application/json" \
  -d '{"notes":[{"title":"One","content":"First"},{"title":"","content":"Bad title"},{"title":"Two","type":"checklist","items":[{"text":"Task"}]}]}'

echo ""
echo "=== Done ==="
