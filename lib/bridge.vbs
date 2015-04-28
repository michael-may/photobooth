Dim appObj
Dim javaScriptFile

Dim fsObj : Set fsObj = CreateObject("Scripting.FileSystemObject")

Dim jsxFile : Set jsxFile = fsObj.OpenTextFile(fsObj.GetParentFolderName(WScript.ScriptFullName) + "/actions.jsx", 1, false)

Dim fileContents : fileContents = jsxFile.ReadAll

jsxfile.Close
Set jsxFile = Nothing
Set fsObj = Nothing

javaScriptFile = fileContents

Set appObj = createObject("Photoshop.Application")

DIM status : status = appObj.DoJavaScript(javascriptFile, Array(), 1)