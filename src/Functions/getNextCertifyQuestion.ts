const questions = [
    { question: "Where can you find the management handbook?", options: ["Training Center", "Game Lobby", "Documents Channel", "Announcements Channel"], answer: "Documents Channel" },
    { question: "Where can you find the training guide?", options: ["Shift Guide", "Documents Channel", "General Chat", "Training Lobby"], answer: "Documents Channel" },
    { question: "Where can you find the shift guide?", options: ["Documents Channel", "Staff Announcements", "Training Guide", "Main Game"], answer: "Documents Channel" },
    { question: "When are you NOT permitted to host shifts?", options: ["During busy hours", "On weekends", "30 minutes before training sessions", "After 10 PM"], answer: "30 minutes before training sessions" },
    { question: "How do you claim host or co-host of a training session?", options: ["Ask in staff chat", "Claim on Hyra if you meet the rank requirement", "Use the /announce command", "Message a supervisor"], answer: "Claim on Hyra if you meet the rank requirement" },
    { question: "Where can you find rank requirements for training roles?", options: ["Staff Directory", "Rank Overview Guide", "Training Guide", "Announcements Channel"], answer: "Training Guide" },
    { question: "How do you get the Trainer or Assistant role in training?", options: ["Join the game at XX:30", "Join the training session at XX:20 (40 minutes before) and click \"Join Role Queue\" in-game", "Request the role from a manager", "Wait for the host to assign it"], answer: "Join the training session at XX:20 (40 minutes before) and click \"Join Role Queue\" in-game" },
    { question: "How do you host a shift?", options: ["Use the /announce shift command to host and start", "Post in the announcements channel", "Send a private message to all staff", "Log into the shift dashboard"], answer: "Use the /announce shift command to host and start" },
    { question: "How do you announce a training?", options: ["Post in the announcements channel", "Use the /announce training command", "Start a session without notice", "Notify the staff team in chat"], answer: "Use the /announce training command" },
    { question: "Is grammar required in the main game?", options: ["No", "Yes", "Only during events", "Only for staff meetings"], answer: "Yes" },
    { question: "Is grammar required in the training center?", options: ["No", "Only for hosts", "Yes", "Only for the co-host"], answer: "Yes" },
    { question: "Is the uniform required in the main game?", options: ["Yes", "Only for supervisors", "No", "Only during shifts"], answer: "No" },
    { question: "Is the uniform required in the training center?", options: ["No", "Only for the host", "Yes", "Only for senior staff"], answer: "Yes" },
    { question: "Is the training guide required to be open during training sessions?", options: ["No", "Only for the co-host", "Yes", "Only for staff above Assistant Trainer"], answer: "Yes" },
    { question: "Where can you find a link to our Hyra workspace?", options: ["Documents Channel", "Announcements Channel", "General Chat", "Staff Directory"], answer: "Documents Channel" },
    { question: "What is the Shift Cooldown?", options: ["30 minutes", "1 hour", "2 hours", "3 hours"], answer: "1 hour" }
]

export async function getNextQuestion(currentQuestion) {
    if (currentQuestion >= questions.length) return null
    return questions[currentQuestion-1]    
}

export async function checkQuestionAnswer(currentQuestion, personAnswer) {
    const answers = ["a", "b", "c", "d"]
    
    const correctanswer = questions[currentQuestion-1].options.indexOf(questions[currentQuestion-1].answer)
    const useranswer = answers.indexOf(personAnswer.toLowerCase())

    if (correctanswer == useranswer) return true
    else return false
}