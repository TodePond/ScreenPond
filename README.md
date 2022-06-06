# ScreenPond
screens in screens in screens

I'm making this engine for my next video about SCREENS inside screens inside screens inside screens<br>
for my channel: [youtube.com/c/TodePond](https://youtube.com/c/TodePond)

## Running
To run locally...<br>
you need to run a local server because it uses javascript modules.<br>
(ie: you can't just open `index.html` like most of my other projects)<br>

I recommend getting [deno](https://deno.land)
and then installing `file_server` with this command:
```
deno install --allow-read --allow-net -f https://deno.land/std@0.142.0/http/file_server.ts
```
Then you can run this command to run a local server:
```
file_server
```
