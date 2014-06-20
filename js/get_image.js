function clickbutton(){
	var file = document.getElementById("file");
	file.click();
}

function fileget(imgfile) {
		if(!imgfile.files.length) return;
		var file=imgfile.files[0];
		var fr=new FileReader();
		fr.onload=function(evt) {
			document.getElementById("photo").value = evt.target.result;
		}
		fr.readAsDataURL(file);
	}
	
function editfileget(imgfile) {
		if(!imgfile.files.length) return;
		var file=imgfile.files[0];
		var fr=new FileReader();
		fr.onload=function(evt) {
			document.getElementById("edit_photo").innerHTML="<img id = 'photo' src="+evt.target.result+">";
		}
		fr.readAsDataURL(file);
	}