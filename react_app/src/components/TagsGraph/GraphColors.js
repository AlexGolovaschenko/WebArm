// const colors = [
//     '#19CDD7', '#DDB27C', '#88572C', 
//     '#FF991F', '#F15C17', '#223F9A', 
//     '#DA70BF', '#125C77', '#4DC19C', 
//     '#776E57', '#12939A', '#17B8BE', 
//     '#F6D18A', '#B7885E', '#FFCB99', 
//     '#F89570', '#829AE3', '#E79FD5', 
//     '#1E96BE', '#89DAC1', '#B3AD9E'
// ]

const colors = [
    '#f44336', '#00BCD4', '#FF9800', 
    '#E91E63', '#009688', '#FF5722', 
    '#9C27B0', '#4CAF50', '#795548', 
    '#673AB7', '#8BC34A', '#607D8B', 
    '#3F51B5', '#CDDC39', 
    '#2196F3', '#FFEB3B', 
    '#03A9F4', '#FFC107', 
]


export default function getColor(index) {
    const clorsNumber = colors.length
    var ind
    if (index+1 > clorsNumber) {
        ind = index % clorsNumber
    }
    else {
        ind = index
    }
    return colors[ind]
}