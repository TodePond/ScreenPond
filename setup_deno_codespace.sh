curl -fsSL https://deno.land/install.sh | sh &&
export PATH="/home/codespace/.deno/bin:$PATH" &&
deno install -f --allow-net --allow-read https://deno.land/std@0.106.0/http/file_server.ts