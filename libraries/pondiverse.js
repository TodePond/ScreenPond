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
		font-size: 20px;
	}

	.pondiverse-button:hover {
		transform: scale(1.1);
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
}
