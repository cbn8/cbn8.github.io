const QuizApp = {
  // Constants and Variables
  csvFiles: [
    { fileName: "db01.csv", displayName: "DB01" },
    { fileName: "db02.csv", displayName: "DB02" },
    { fileName: "db03.csv", displayName: "DB03" },
    { fileName: "db04.csv", displayName: "DB04" },
    { fileName: "db05.csv", displayName: "DB05" },
    // Add more objects for additional CSV files if needed
  ],
  defaultCsvFileName: "db01.csv",
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
    const dropdownOptions = this.csvFiles
      .map(
        (csvFile) =>
          `<option value="${csvFile.fileName}">${csvFile.displayName}</option>`
      )
      .join("");
    this.csvSelect.innerHTML = dropdownOptions;
  },

  // Loading CSV Data
  async loadSelectedCSV() {
    this.currentQuestion = 0;
    this.score = 0;
    this.incorrectQuestions = [];
    this.correctQuestions = [];
    this.reportContainer.innerHTML = "";
    this.reportContainer.style.display = "none";
    this.questionElement.style.display = "block";
    this.optionsElement.style.display = "flex";

    const selectedCsv = this.csvSelect.value;
    try {
      const response = await fetch(`/data/${selectedCsv}`);
      const data = await response.text();
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
    } catch (error) {
      console.error("Error loading CSV:", error);
    }
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

    // Set the 'wrap' class as the first class along with existing 'options' class
    if (this.optionsElement) {
      this.optionsElement.className = `wrap ${this.optionsElement.className}`;
    }

    fetch(`/data/${this.defaultCsvFileName}`)
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
      }

      this.questionElement.textContent = question.Question;

      // Determine the question type and populate the options accordingly
      if (question.Type === "MCQ") {
        const options = [
          question.CorrectAnswer,
          question.Option1,
          question.Option2,
          question.Option3,
        ];
        this.shuffleArray(options);
        options.forEach((option) => {
          const optionButton = this.createOptionButton(option);
          optionButton.addEventListener("click", () =>
            this.checkAnswer(option)
          );
          this.optionsElement.appendChild(optionButton);
        });
      } else if (question.Type === "TrueFalse") {
        ["True", "False"].forEach((option) => {
          const optionButton = this.createOptionButton(option);
          optionButton.addEventListener("click", () =>
            this.checkAnswer(option)
          );
          this.optionsElement.appendChild(optionButton);
        });
      } else if (question.Type === "SelectAll") {
        // Extract correct answers from the CorrectAnswer field
        const correctAnswers = question.CorrectAnswer.split(",");

        // Extract additional options from Option1, Option2, Option3
        const additionalOptions = [
          question.Option1,
          question.Option2,
          question.Option3,
        ].filter(Boolean); // Remove empty options

        // Combine correct answers and additional options
        let allOptions = [...correctAnswers, ...additionalOptions];

        // Shuffle the options using your existing shuffleArray function
        this.shuffleArray(allOptions);

        allOptions.forEach((option) => {
          const checkBox = document.createElement("input");
          checkBox.type = "checkbox";
          checkBox.value = option;

          const label = document.createElement("label");
          label.textContent = option;
          label.appendChild(checkBox);

          this.optionsElement.appendChild(label);
        });

        // Create and add the submit button with the additional class
        this.createSubmitButton();
      }

      this.addStyleClassesToQuestionElement();
    } else {
      this.displayReport();
      this.questionElement.textContent = "";
      this.optionsElement.innerHTML = "";
    }
  },

  createOptionButton(optionText) {
    const optionButton = document.createElement("button");
    optionButton.textContent = optionText;
    optionButton.classList.add("button-size-m"); // Added this line to add the class
    return optionButton;
  },

  createSubmitButton() {
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.classList.add("button-size-m"); // Added this line to add the class
    submitButton.addEventListener("click", () => {
      const checkedOptions = Array.from(
        this.optionsElement.querySelectorAll('input[type="checkbox"]:checked')
      ).map((checkbox) => checkbox.value);
      this.checkAnswer(checkedOptions);
    });
    this.optionsElement.appendChild(submitButton);
  },

  addStyleClassesToQuestionElement() {
    const questionElement = document.querySelector(".question");
    if (questionElement) {
      questionElement.classList.add("text-size-l", "text-type-subheading");
    }
  },

  // Checking Answers
  checkAnswer(selectedAnswer) {
    const currentQuestionObj = this.questions[this.currentQuestion];
    const correctAnswer = currentQuestionObj.CorrectAnswer;
    const type = currentQuestionObj.Type;

    let isCorrect = false;

    if (type === "MCQ" || type === "TrueFalse") {
      isCorrect = selectedAnswer === correctAnswer;
    } else if (type === "SelectAll") {
      // Split the correct answer into an array and sort it
      const sortedCorrectAnswers = correctAnswer.split(",").sort();

      // Sort the selected answers
      const sortedSelectedAnswers = selectedAnswer.sort();

      isCorrect = this.areArraysEqual(
        sortedSelectedAnswers,
        sortedCorrectAnswers
      );
    }

    if (isCorrect) {
      this.score++;
      this.correctQuestions.push(currentQuestionObj);
    } else {
      this.incorrectQuestions.push({ ...currentQuestionObj, selectedAnswer });
    }

    this.currentQuestion++;
    this.displayQuestion();
  },

  areArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    return arr1.every((value, index) => value === arr2[index]);
  },

  // Displaying Report
  displayReport() {
    // Clear previous report if any
    this.reportContainer.innerHTML = "";

    // Hide the options element
    this.optionsElement.style.display = "none";

    // Hide the question element
    this.questionElement.style.display = "none";

    // Add the "wrap" class to the "report" container with "report" class coming after it
    this.reportContainer.classList.add("wrap", "report");

    this.incorrectQuestions.forEach((incorrectQuestion, i) => {
      const reportElement = this.createReportElement(incorrectQuestion, i);
      this.reportContainer.appendChild(reportElement);
    });

    this.correctQuestions.forEach((correctQuestion, i) => {
      const reportElement = this.createReportElement(correctQuestion, i, true);
      this.reportContainer.appendChild(reportElement);
    });

    this.reportContainer.style.display = "flex";

    const quizProgressDiv = document.querySelector(".quiz-progress");
    if (quizProgressDiv) {
      const scorePercentage = (
        (this.score / this.totalQuestions) *
        100
      ).toFixed(0);
      quizProgressDiv.innerHTML = `<strong>${scorePercentage}%</strong> - ${this.score} / ${this.totalQuestions}`;
    }
  },

  createReportElement(question, index, isCorrect = false) {
    const reportElement = document.createElement("div");
    reportElement.classList.add(
      isCorrect ? "correct-question" : "incorrect-question"
    );

    if (isCorrect) {
      reportElement.classList.add("primary");
      reportElement.classList.add("on-primary-text");
    } else {
      reportElement.classList.add("error");
      reportElement.classList.add("on-error-text");
    }

    reportElement.innerHTML = `
      <div class="question text-size-l text-type-subheading"><strong>${
        index + 1
      }.</strong> ${this.sanitizeHtml(question.Question)}</div>
      <div class="${
        isCorrect
          ? "correct-answer text-size-m text-type-body"
          : "incorrect-answer text-size-m text-type-body"
      }"><strong>${
      isCorrect ? "Correct Answer" : "Your Answer"
    }</strong>: ${this.sanitizeHtml(
      isCorrect
        ? this.formatCorrectAnswer(question.CorrectAnswer)
        : question.selectedAnswer || "Not answered"
    ).replace(/,/g, ", ")}</div>
    `;
    if (!isCorrect) {
      const correctAnswerElement = document.createElement("div");
      correctAnswerElement.classList.add(
        "correct-answer",
        "text-size-m",
        "text-type-body"
      );
      correctAnswerElement.innerHTML = `<strong>Correct Answer</strong>: ${this.sanitizeHtml(
        this.formatCorrectAnswer(question.CorrectAnswer)
      ).replace(/,/g, ", ")}`;
      reportElement.appendChild(correctAnswerElement);
    }

    const reasonElement = document.createElement("div");
    reasonElement.classList.add(
      "reason",
      "text-size-m",
      "text-type-body",
      "reset-margin"
    );
    reasonElement.innerHTML = `<strong>Reason</strong>: ${this.sanitizeHtml(
      question.Reason
    )}`;
    reportElement.appendChild(reasonElement);

    return reportElement;
  },

  formatCorrectAnswer(correctAnswer) {
    if (Array.isArray(correctAnswer)) {
      return correctAnswer.join(", ").replace(/,/g, ", ");
    } else if (typeof correctAnswer === "string") {
      return correctAnswer.replace(/,/g, ", ");
    }
    return correctAnswer;
  },
};

// Call the initialization function to start the app
QuizApp.init();
