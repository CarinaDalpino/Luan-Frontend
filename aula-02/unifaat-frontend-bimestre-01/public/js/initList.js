import createNameList from "./createNameList.js";
import editNameList from "./editNameList.js";
import jsonContent from "../example.json" with { type: "json" };

export default function initList(ulElement) {

    jsonContent.data.forEach(({ name }) => {

        const liElement = createNameList(name);

        const nameElement = liElement.querySelector("span");

        nameElement.addEventListener("click", () => {
            editNameList(liElement);
        });

        ulElement.append(liElement);
    });

}
