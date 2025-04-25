export function addPondiverseButton() {
  const style = `
	.pondiverse-button-container {
		position: fixed;
		box-sizing: border-box;
		bottom: 0;
		right: 0;
		z-index: 9999;
	}

	.pondiverse-button {
		border-radius: 100%;
		background-color: #4680ff;
		border: white 3px solid;
		height: 45px;
		width: 45px;
		cursor: pointer;
		margin: 10px;
		transition: transform 0.2s;
		color: white;
		font-size: 25px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	}

	.pondiverse-button:hover {
		transform: scale(1.1);
	}

	#pondiverse-dialog {
		color: white;
		font-size: 20px;
		text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
		font-family: sans-serif;
		padding: 0px;
		background-color: transparent;
		border: none;
	}

	#pondiverse-dialog a {
		color: #46ff80;
		font-weight: bold;
	}

	#pondiverse-dialog a:focus {
		outline: 2px solid #46ff80;
	}

	#pondiverse-dialog a:hover {
		background-color: #46ff80;
		color: black;
		text-shadow: none;
		text-decoration: none;
		outline: 2px solid #46ff80;
	}

	#pondiverse-dialog form {
		// box-sizing: border-box;
		background-color: #4680ff;
		border-radius: 20px;
		outline: none;
		border: 3px solid white;
		padding: 20px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	}

	#pondiverse-dialog input[type="text"] {
		width: 100%;
		padding: 10px 15px;
		margin: 10px 0;
		border: 3px inset #3670ee;
		border-radius: 10px;
		background-color: #fff;
		color: #000;
		font-size: 16px;
	}

	#pondiverse-dialog:focus {
		outline: none;
	}

	#pondiverse-dialog input[type="text"]:focus {
		outline: 2px solid #46ff80;
		outline-offset: 0px;
	}

	#pondiverse-dialog button {
		background-color: #4680ff;
		padding: 10px 20px;
		border-radius: 10px;
		cursor: pointer;
		font-size: 16px;
		color: white;
		margin-top: 10px;
		border: 3px outset #3670ee;
		user-select: none;
	}

	#pondiverse-dialog button:focus {
		border: 3px inset #3670ee;
	}

	#pondiverse-dialog hgroup.space {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	#pondiverse-dialog #preview-image {
		max-width: 100%;
		max-height: 300px;
		margin: 10px auto;
	}
  `;

  const styleSheet = document.createElement("style");
  styleSheet.innerText = style;
  document.head.appendChild(styleSheet);

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "pondiverse-button-container";

  const button = document.createElement("button");
  button.className = "pondiverse-button";
  button.textContent = "✶";

  buttonContainer.append(button);
  document.body.append(buttonContainer);

  const dialog = document.createElement("dialog");
  document.body.append(dialog);
  dialog.id = "pondiverse-dialog";

  dialog.innerHTML = `
  <form>
	<p>Do you want to share your creation to the <a href="https://pondiverse.com">Pondiverse</a>?</p>
	<p>All creations get deleted after 25 hours.</p>
	<p><img id="preview-image" src="" alt="Thumbnail of your creation"></p>
	<label for="name">Title</label>
	<input type="text" id="name" name="name" required autocomplete="off" spellcheck="false" />
	<input type="hidden" name="data" value="" />
	<hgroup class="space">
		<button type="button" class="secondary" id="cancel">Cancel</button>
		<button type="submit">Publish</button>
	</hgroup>
  </form>
  `;

  const previewImage = dialog.querySelector("#preview-image");
  previewImage.onerror = () => {
    previewImage.style.display = "none";
  };
  previewImage.onload = () => {
    previewImage.style.display = "block";
  };

  const nameInput = dialog.querySelector("#name");
  nameInput.addEventListener(
    "input",
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      e.stopImmediatePropagation();
      console.log("test");
    },
    { passive: false, bubble: false }
  );

  dialog.addEventListener("pointerdown", (e) => e.stopPropagation());
  button.addEventListener("pointerdown", (e) => e.stopPropagation());
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    openPondiverseDialog();
  });

  const cancelButton = dialog.querySelector("#cancel");
  cancelButton.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    closePondiverseDialog();
  });

  //   openPondiverseDialog();
}

export function openPondiverseDialog() {
  const dialog = document.getElementById("pondiverse-dialog");
  if (!dialog) {
    throw new Error(
      "Pondiverse dialog not found. Make sure you run addPondiverseButton() first."
    );
  }
  dialog.showModal();
  const titleInput = dialog.querySelector("#name");
  titleInput.value = "";
  const previewImage = dialog.querySelector("#preview-image");
  const getPreviewImage = window.getPondiverseThumbnail;
  if (!getPreviewImage) {
    console.warn(
      "window.getPondiverseThumbnail() function not found. If you want your creation to have a thumbnail, add a function that returns a base64 image string to window.getPondiverseThumbnail()"
    );
  } else {
    const image = getPreviewImage();
    if (image) {
      previewImage.src = image;
    }
  }

  const hiddenInput = dialog.querySelector("input[name='data']");
  const getData = window.getPondiverseData;
  if (!getData) {
    console.warn(
      "window.getPondiverseData() function not found. If you want your creation to have some data attached to it, add a function that returns a string to window.getPondiverseData()"
    );
  } else {
    const data = getData();
    if (data) {
      hiddenInput.value = data;
    }
  }
  titleInput.focus();
}

export function closePondiverseDialog() {
  const dialog = document.getElementById("pondiverse-dialog");
  if (!dialog) {
    throw new Error(
      "Pondiverse dialog not found. Make sure you run addPondiverseButton() first."
    );
  }
  dialog.close();
}
