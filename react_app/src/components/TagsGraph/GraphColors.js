
const colors = ['#3a3', '#fc0', '#337', '#f93', '#337', '#cf3', '#766']


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