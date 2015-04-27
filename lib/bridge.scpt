set UnixPath to POSIX path of ((path to me as text) & "::") & "actions.jsx"
tell application "Adobe Photoshop"
	activate & do javascript file UnixPath
end tell