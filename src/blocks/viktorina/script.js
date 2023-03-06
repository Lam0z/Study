let questions = [['Сколько спутников у Земли?',1],['Сколько спутников у Сатурна?',3],['Сколько спутников у Солнца?',0]]
let score = 0
let answer
function taskAnswers(question){
    answer=prompt(question[0],'')
    if(question[1]==answer){
        alert('Верно')
        score++
    }else{
        alert('Neverno')
    }
    console.log('Правельных ответов: '+score +' из '+questions.length);
}
for (let i = 0; i < questions.length; i++) {
    taskAnswers(questions[i])
}