const colors = [
    '#ffcdd2', '#B2DFDB', '#BBDEFB', 
    '#F0F4C3', '#E1BEE7', '#C8E6C9',  
    '#FFCCBC','#FFECB3',  '#D7CCC8', 
    '#CFD8DC'
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