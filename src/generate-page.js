const fs = require("fs");
const path = require("path");

const dirname = path.join(__dirname, "..");

try {
  // const docsPath = path.resolve(dirname, 'docs')
  // const docsDirectories = fs.readdirSync(docsPath)

  // docsDirectories.forEach(dir => {
  //   const dirPath = path.resolve(docsPath, dir)

  //   console.log({dirPath});
  // })
  // generateHtml()

  // generateVersionedDocs()
  generateDynamicHtmlPage();

  // console.log({ dirname, docsPath, docsDirectories})
} catch (e) {
  console.log({ e });
}
// directory, fileName, bodyContent

function generateHtml(content) {
  try {
    const templateContent = getTemplateContent();
    const htmlFile = convertStringToHtml(templateContent);
    const html = writeHTML(htmlFile, content);
    const sourcePath = path.join(dirname, "src", "index.html");
    fs.writeFileSync(sourcePath, templateContent.toString(), { flag: "w+" });

    console.log({ templateContent: templateContent.toString() });
  } catch (e) {
    console.log("Error in generateHtml", { e });
  }
}

/**
 * Read the content of a template.html file and convert it to string
 * @returns {string} - the content of template.html file
 */
function getTemplateContent() {
  const templatePath = path.join(dirname, "src", "template.html");
  return fs.readFileSync(templatePath).toString();
}

function setContentToTemplate(template, changes) {
  changes.forEach(({ content, replacement }) => {
    template = template.replaceAll(replacement, content);
  });
  return template;
}

function appendContentToTemplate(template, changes) {
  changes.forEach(({ content, replacement }) => {
    content += `\n${replacement}`;
    template = template.replaceAll(replacement, content);
  });
  return template;
}

/**
 * Get contents of the directory
 * @param {string} directory - The directory that getting contents of that
 * @returns {string[]} - contents of directory
 */
function getContentsOfDirectory(directory) {
  try {
    const directoryPath = path.resolve(dirname, directory);
    return fs.readdirSync(directoryPath);
  } catch (error) {
    console.log("Error in getDirectories", { error });
    return [];
  }
}

/**
 * Generate a HTML file for each directory that exist in docs directory
 */
function generateVersionedDocs() {
  const directories = getContentsOfDirectory("docs");
  const template = getTemplateContent();

  directories.forEach((directory) => {
    const directoryPath = path.resolve(docsPath, directory);
    const bodyContent = `
      <h1>${directory} File</h1>
    `;

    const changes = [
      {
        content: bodyContent,
        replacement: "${body}",
      },
      {
        content: `${directory} document`,
        replacement: "${title}",
      },
    ];
    const content = setContentToTemplate(template, changes);
    const sourcePath = path.join(directoryPath, "index.html");

    fs.writeFileSync(sourcePath, content, { flag: "w+" });

    console.log({ directoryPath });
  });
}

function getLinkTemplate(text, href) {
  const link = `../docs/${href}/index.html`;
  return `
    <div class="d-flex text-body-secondary pt-3 border-bottom bg-primary-hover">
      <p class="pb-3 mb-0 small lh-sm text-gray-dark" >
        <a href="${link}" class="d-block link-primary">
          <strong>${text}</strong>
        </a>
        Some representative placeholder content, with some information about this user. Imagine this being some sort of status update, perhaps?
      </p>
    </div>
  `;
}

function generateDynamicHtmlPage() {
  const sourcePath = path.join(dirname, "src", "index.html");
  const directoryContents = getContentsOfDirectory("docs");
  let template = getTemplateContent();

  // directoryContents.forEach((dir) => {
  //   const changes = [
  //     {
  //       replacement: "${body}",
  //       content: getLinkTemplate(`${dir}`, dir),
  //     },
  //   ];
  //   template = appendContentToTemplate(template, changes);
  // });
  template = setContentToTemplate(template, [
    {replacement: "`${directories}`", content: `[${directoryContents.map(i => `"${i}"`)}]`}
  ]);
  fs.writeFileSync(sourcePath, template, { flag: "w+" });

  console.log({ template });
}
