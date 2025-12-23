import inquirer from "inquirer";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

async function mainMenu() {
  while (true) {
    const { choice } = await inquirer.prompt([
      {
        type: "rawlist", // 👈 NUMBERED MENU
        name: "choice",
        message: "=== QUOTES API TEST MENU ===",
        choices: [
          { name: "Get random quote", value: "random" },
          { name: "Get random quote by tag", value: "randomByTag" },
          { name: "Get all quotes", value: "quotes" },
          { name: "Create quote", value: "createQuote" },
          { name: "Create author", value: "createAuthor" },
          { name: "List authors", value: "authors" },
          { name: "Create tag", value: "createTag" },
          { name: "List tags", value: "tags" },
          new inquirer.Separator(),
          { name: "Exit", value: "exit" },
        ],
      },
    ]);

    switch (choice) {
      case "createQuote":
        await createQuote();
        break;
      case "random":
        await getRandomQuote();
        break;

      case "randomByTag":
        await getRandomQuoteByTag();
        break;

      case "quotes":
        await getAllQuotes();
        break;

      case "createAuthor":
        await createAuthor();
        break;

      case "authors":
        await listAuthors();
        break;

      case "createTag":
        await createTag();
        break;

      case "tags":
        await listTags();
        break;

      case "exit":
        console.log("👋 Bye!");
        process.exit(0);
    }

    await inquirer.prompt([
      {
        type: "input",
        name: "continue",
        message: "Press ENTER to return to menu",
      },
    ]);
  }
}

async function getRandomQuote() {
  const res = await axios.get(`${API_URL}/quotes/random`);
  console.log(res.data);
}

async function getRandomQuoteByTag() {
  const { tag } = await inquirer.prompt([
    { type: "input", name: "tag", message: "Enter tag:" },
  ]);

  try {
    const res = await axios.get(`${API_URL}/quotes/random?tag=${tag}`);
    console.log(res.data);
  } catch (e: any) {
    console.error("Error:", e.response?.data || e.message);
  }
}

async function getAllQuotes() {
  const res = await axios.get(`${API_URL}/quotes`);
  console.table(
    res.data.map((q: any) => ({
      id: q.id,
      text: q.text.slice(0, 40) + "...",
      author: q.author?.name,
    }))
  );
}
async function createQuote() {
  console.log("\n=== CREATE QUOTE ===\n");

  // 1️⃣ Quote text
  const { text } = await inquirer.prompt([
    {
      type: "input",
      name: "text",
      message: "Quote text:",
      validate: (v) => v.trim().length > 5 || "Quote is too short",
    },
  ]);

  // 2️⃣ Fetch authors
  const authorsRes = await axios.get(`${API_URL}/authors`);
  const authors = authorsRes.data;

  if (!authors.length) {
    console.log("❌ No authors found. Create an author first.");
    return;
  }

  const { authorId } = await inquirer.prompt([
    {
      type: "list",
      name: "authorId",
      message: "Select author:",
      choices: authors.map((a: any) => ({
        name: a.name,
        value: a.id,
      })),
    },
  ]);

  // 3️⃣ Fetch tags
  const tagsRes = await axios.get(`${API_URL}/tags`);
  const tags = tagsRes.data;

  let tagIds: number[] = [];

  if (tags.length) {
    const tagAnswer = await inquirer.prompt([
      {
        type: "checkbox",
        name: "tagIds",
        message: "Select tags (space to select):",
        choices: tags.map((t: any) => ({
          name: t.name,
          value: t.id,
        })),
      },
    ]);
    tagIds = tagAnswer.tagIds;
  }

  // 4️⃣ Language
  const { language } = await inquirer.prompt([
    {
      type: "input",
      name: "language",
      message: "Language:",
      default: "en",
    },
  ]);

  const payload = {
    text,
    language,
    authorId,
    tagIds,
  };

  console.log("\n📤 Quote to be created:");
  console.table(payload);

  // 5️⃣ Confirmation
  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "Create this quote?",
      default: true,
    },
  ]);

  if (!confirm) {
    console.log("❌ Quote creation cancelled");
    return;
  }

  // 6️⃣ Send request
  try {
    const res = await axios.post(`${API_URL}/quotes`, payload);
    console.log("✅ Quote created successfully!");
    console.log(res.data);
  } catch (e: any) {
    console.error("❌ Error:", e.response?.data || e.message);
  }
}

async function createAuthor() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Author name:",
      validate: (v) => v.trim() !== "" || "Name cannot be empty",
    },
  ]);

  console.log("\n📤 Sending data:");
  console.table(answers);

  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "Create this author?",
      default: true,
    },
  ]);

  if (!confirm) {
    console.log("❌ Author creation cancelled");
    return;
  }

  try {
    const res = await axios.post(`${API_URL}/authors`, answers);
    console.log("✅ Author created:");
    console.table(res.data);
  } catch (e: any) {
    console.error("❌ Error:", e.response?.data || e.message);
  }
}

async function listAuthors() {
  const res = await axios.get(`${API_URL}/authors`);
  console.table(res.data);
}

async function createTag() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Tag name:",
      validate: (v) => v.trim() !== "" || "Tag name cannot be empty",
    },
  ]);

  console.log("\n📤 Sending data:");
  console.table(answers);

  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "Create this tag?",
      default: true,
    },
  ]);

  if (!confirm) {
    console.log("❌ Tag creation cancelled");
    return;
  }

  try {
    const res = await axios.post(`${API_URL}/tags`, answers);
    console.log("✅ Tag created:");
    console.table(res.data);
  } catch (e: any) {
    console.error("❌ Error:", e.response?.data || e.message);
  }
}

async function listTags() {
  const res = await axios.get(`${API_URL}/tags`);
  console.table(res.data);
}

// START
mainMenu();
