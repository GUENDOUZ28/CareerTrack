Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.Run "node --experimental-sqlite server/index.js", 0, False
WScript.Sleep 1000
WshShell.Run "http://localhost:3001"
