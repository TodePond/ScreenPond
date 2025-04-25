export function addPondiverseButton() {
  const style = `
	.pondiverse-button-container {
		position: fixed;
		box-sizing: border-box;
		bottom: 0;
		right: 0;
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
		box-sizing: border-box;
		font-family: sans-serif;
		background-color: #4680ff;
		border-radius: 20px;
		outline: none;
		border: 3px solid white;
		padding: 20px;
		z-index: 1000;
		width: 100%;
		height: 100%;
		max-width: 1000px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	}

	#pondiverse-dialog a {
		color: #46ff80;
		font-weight: bold;
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
  <div class="pondiverse-dialog">
  <p>Do you want to share your creation to the <a href="https://pondiverse.com">Pondiverse</a>?</p>
  <p>All creations get deleted after 25 hours.</p>
  <form>
    <label for="name">Title:</label>
	<input type="text" id="name" name="name" required>
	<br>
	<br>
	<button type="submit">Submit</button>
  </form>
  </div>
  `;

  dialog.addEventListener("pointerdown", (e) => e.stopPropagation());
  button.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    dialog.showModal();
  });
  dialog.showModal();
}
