param(
  [Parameter(Position = 0)]
  [string]$Mode = "dev",
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$ExtraArgs
)

$nodePath = Join-Path $env:ProgramFiles "nodejs\node.exe"
$vitePath = Join-Path $PSScriptRoot "..\..\node_modules\vite\bin\vite.js"

switch ($Mode) {
  "build" {
    & $nodePath $vitePath build --configLoader native @ExtraArgs
    break
  }
  "preview" {
    & $nodePath $vitePath preview --host 0.0.0.0 --port 3000 --configLoader native @ExtraArgs
    break
  }
  default {
    & $nodePath $vitePath --host 0.0.0.0 --port 3000 --configLoader native @ExtraArgs
    break
  }
}
