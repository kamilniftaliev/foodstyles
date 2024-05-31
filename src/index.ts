import { extractEntities } from "./search";
import { createInterface } from "readline";

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askToSearch() {
  readline.question(
    "\nType and press Enter to search...\n\n",
    (searchTerm: string) => {
      extractEntities(searchTerm);

      askToSearch();
    }
  );
}

(async () => {
  await extractEntities("Sushi in London or Manchester");

  askToSearch();
})();
