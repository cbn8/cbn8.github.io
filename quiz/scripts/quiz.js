const QuizApp = {
  // Constants and Variables
  csvFiles: [
    { fileName: "webdev-1.csv", displayName: "Web: Web Development 1" },
    { fileName: "webdev-2.csv", displayName: "Web: Web Development 2" },
    { fileName: "cssintro.csv", displayName: "Web: CSS Intro 1" },
    { fileName: "cssflex.csv", displayName: "Web: CSS Flex 1" },
    { fileName: "javascript-1.csv", displayName: "Web: JavaScript 1" },
    { fileName: "ositcpip.csv", displayName: "Networking: OSI & TCP/IP" },
    // Add more objects for additional CSV files if needed
  ],

  defaultCsvFileName: "https://nathaniellr.github.io/quiz/data/webdev-1.csv",

  currentQuestion: 0,
  score: 0,
  totalQuestions: 0,
  incorrectQuestions: [],
  correctQuestions: [],
  questions: [],

  // DOM Elements
  questionElement: document.querySelector(".question"),
  optionsElement: document.querySelector(".options"),
  reportContainer: document.querySelector(".report"),
  csvSelect: document.querySelector(".csvselect"),

  // Utility Functions
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  },

  sanitizeHtml(html) {
    const div = document.createElement("div");
    div.textContent = html;
    return div.innerHTML;
  },

  // Dropdown Population
  populateCsvDropdown() {
    this.csvSelect.innerHTML = this.csvFiles
      .map(
        (csvFile) =>
          `<option value="${csvFile.fileName}">${csvFile.displayName}</option>`
      )
      .join("");
  },

  // Loading CSV Data
  loadSelectedCSV() {
    this.currentQuestion = 0;
    this.score = 0;
    this.incorrectQuestions = [];
    this.correctQuestions = [];
    this.reportContainer.innerHTML = "";
    this.reportContainer.style.display = "none";
    this.questionElement.style.display = "block";
    this.optionsElement.style.display = "flex";

    const selectedCsv = this.csvSelect.value;
    fetch(`https://nathaniellr.github.io/quiz/data/${selectedCsv}`)
      .then((response) => response.text())
      .then((data) => {
        this.questions = Papa.parse(data, {
          header: true,
          dynamicTyping: true,
        }).data;
        this.totalQuestions = this.questions.length;
        this.shuffleArray(this.questions);
        const selectedDisplayName = this.csvFiles.find(
          (csvFile) => csvFile.fileName === selectedCsv
        )?.displayName;
        const quizTitle = document.querySelector(".quiztitle");
        if (selectedDisplayName) {
          quizTitle.textContent = selectedDisplayName;
        }
        this.displayQuestion();
      })
      .catch((error) => {
        console.error("Error loading CSV:", error);
      });
  },

  // Handling CSV Select Change
  csvSelectChange() {
    this.loadSelectedCSV();
  },

  // Initialization
  init() {
    this.populateCsvDropdown();
    this.csvSelect.addEventListener("change", () => this.csvSelectChange());
    this.reportContainer.innerHTML = "";

    fetch(`https://nathaniellr.github.io/quiz/data/${this.defaultCsvFileName}`)
      .then((response) => response.text())
      .then((data) => {
        this.questions = Papa.parse(data, {
          header: true,
          dynamicTyping: true,
        }).data;
        this.totalQuestions = this.questions.length;
        this.shuffleArray(this.questions);
        const defaultDisplayName = this.csvFiles.find(
          (csvFile) => csvFile.fileName === this.defaultCsvFileName
        )?.displayName;
        const quizTitle = document.querySelector(".quiztitle");
        if (defaultDisplayName) {
          quizTitle.textContent = defaultDisplayName;
        }
        this.displayQuestion();
      });
  },

  // Displaying Questions
  displayQuestion() {
    if (this.currentQuestion < this.questions.length) {
      const question = this.questions[this.currentQuestion];
      this.questionElement.textContent = "";
      this.optionsElement.innerHTML = "";
      const quizProgressDiv = document.querySelector(".quiz-progress");
      if (quizProgressDiv) {
        quizProgressDiv.innerHTML = `<strong>Question ${
          this.currentQuestion + 1
        } </strong>/ ${this.totalQuestions}`;
        const questionTextDiv = document.createElement("div");
        questionTextDiv.textContent = question.Question;
        this.questionElement.appendChild(questionTextDiv);
        const options = [
          question.CorrectAnswer,
          question.Option1,
          question.Option2,
          question.Option3,
        ];
        this.shuffleArray(options);
        options.forEach((option) => {
          const optionButton = document.createElement("button");
          optionButton.textContent = option;
          optionButton.addEventListener("click", () =>
            this.checkAnswer(option)
          );
          this.optionsElement.appendChild(optionButton);
        });
      }

      // Add style classes to .question element
      const questionElement = document.querySelector(".question");
      if (questionElement) {
        questionElement.classList.add("text-size-l", "text-type-subheading");
      }
    } else {
      const percentageScore = (
        (this.score / this.totalQuestions) *
        100
      ).toFixed(0);
      this.displayReport();
      this.questionElement.textContent = "";
      this.optionsElement.innerHTML = "";
    }
  },

  // Checking Answers
  checkAnswer(selectedAnswer) {
    const correctAnswer = this.questions[this.currentQuestion].CorrectAnswer;
    const reason = this.questions[this.currentQuestion].Reason;
    if (selectedAnswer === correctAnswer) {
      this.score++;
      this.correctQuestions.push(this.questions[this.currentQuestion]);
    } else {
      this.incorrectQuestions.push({
        ...this.questions[this.currentQuestion],
        selectedAnswer,
      });
    }
    this.currentQuestion++;
    this.displayQuestion();
  },

  // Displaying Report
  displayReport() {
    for (let i = 0; i < this.incorrectQuestions.length; i++) {
      const incorrectQuestion = this.incorrectQuestions[i];
      const reportElement = document.createElement("div");
      reportElement.classList.add("incorrect-question");
      reportElement.innerHTML = `
        <div class="question text-size-l text-type-subheading"><strong>${
          i + 1
        }.</strong> ${this.sanitizeHtml(incorrectQuestion.Question)}</div>
        <div class="incorrect-answer text-size-m text-type-body"><strong>Incorrect:</strong> ${this.sanitizeHtml(
          incorrectQuestion.selectedAnswer
            ? incorrectQuestion.selectedAnswer
            : "Not answered"
        )}</div>
        <div class="correct-answer text-size-m text-type-body"><strong>Correct:</strong> ${this.sanitizeHtml(
          incorrectQuestion.CorrectAnswer
        )}</div>
        <div class="reason text-size-m text-type-body reset-margin"><strong>Reason:</strong> ${this.sanitizeHtml(
          incorrectQuestion.Reason
        )}</div>
      `;
      this.reportContainer.appendChild(reportElement);
    }
    for (let i = 0; i < this.correctQuestions.length; i++) {
      const correctQuestion = this.correctQuestions[i];
      const reportElement = document.createElement("div");
      reportElement.classList.add("correct-question");
      reportElement.innerHTML = `
        <div class="question text-size-l text-type-subheading"><strong>${
          i + 1
        }.</strong> ${this.sanitizeHtml(correctQuestion.Question)}</div>
        <div class="correct-answer text-size-m text-type-body"><strong>Correct Answer:</strong> ${this.sanitizeHtml(
          correctQuestion.CorrectAnswer
        )}</div>
        <div class="reason text-size-m text-type-body reset-margin"><strong>Reason:</strong> ${this.sanitizeHtml(
          correctQuestion.Reason
        )}</div>
      `;
      this.reportContainer.appendChild(reportElement);
    }

    this.reportContainer.style.display = "block";

    const quizProgressDiv = document.querySelector(".quiz-progress");
    if (quizProgressDiv) {
      const scorePercentage = (
        (this.score / this.totalQuestions) *
        100
      ).toFixed(0);
      quizProgressDiv.innerHTML = `<strong>${scorePercentage}%</strong> - ${this.score} / ${this.totalQuestions}`;
    }
  },
};

// Call the initialization function to start the app
QuizApp.init();
