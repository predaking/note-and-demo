class Chameleon {
    colorChange (newColor) {
        this.newColor = newColor
        return this.newColor
    }

    constructor({ newColor = 'green' } = {}) {
        this.newColor = newColor
    }
}

const freddie = new Chameleon({ newColor: 'purple' })

console.log(freddie.colorChange('orange'));