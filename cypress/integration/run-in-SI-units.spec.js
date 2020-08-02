import Axios from "axios";

describe('Run computation in SI units', function() {
    // it('Login', () => {
    //
    //     cy.visit('/#/signin')
    //
    //     cy.get('input').as('inputsSignin')
    //     cy.get('@inputsSignin').eq(0).clear().type(Cypress.config('user'))
    //     cy.get('@inputsSignin').eq(1).clear().type(Cypress.config('password'))
    //     cy.get('form').contains('Sign in').click()
    //     cy.wait(2000)
    //
    //     // cy.request('POST', 'http://localhost:8090/auth/signin', { username: Cypress.config('user'), password: Cypress.config('password') })
    //     //     .then((response) => {
    //     //         // response.body is automatically serialized into JSON
    //     //         //expect(response.data).to.have.property('name', 'Jane') // true
    //     //         localStorage.setItem('token', JSON.stringify(response.data))
    //     //         console.error('TITI', response)
    //     //     })
    // })

    it('Should open meteor from menu', function() {
        cy.visit('/#/motorDesign')

        cy.get('input#name').should('have.value', '')
        cy.get('#throatDiameter').parent().contains('mm')

        // check message about default unit
        cy.contains('By default you are on metric units. You can change it above.')
    })

    it('Should submit form', function() {
        cy.url().should('include', '/#/motorDesign')

        const formDatas = {
            throatDiameter: 7,
            outerDiameter: 28,
            coreDiameter: 14,
            segmentLength: 80,
            numberOfSegment: 1,
            endsSurface: 'Inhibited',
            coreSurface: 'Exposed',
            outerSurface: 'Inhibited',
            propellantType: 'KNSB (oxidizer finely milled)',
            chamberInnerDiameter: 28,
            chamberLength: 80
        }

        // Flag cypress test in production
        cy.fillForm(formDatas, 'METRIC')

        // Check presence of computationHash
        expect(localStorage.getItem('computationHash')).not.to.be.null
    })

    it('Should check result', () => {
        const expectedResults = {
            motorClasss: 'F82',
            thrustTime: '0.91',
            maxThrust: '111.61',
            totalImpulse: '73.99',
            isp: '116.78',
            maxPressure: '21.87',
            averagePressure: '16.00',
            nozzleExitSpeed: '2.53',
            optimalExpansionRatio: '4.00'
        }

        cy.get('input#motor-class')
            .parent()
            .contains("85%")

        cy.checkPerformanceResults(expectedResults, 'METRIC')
    })

    it('Should design nozzle', () => {
        cy.get('button').contains('Nozzle design').click()

        cy.get('input#convergenceAngle')
            .clear()
            .type(38)

        cy.get('input#divergenceAngle')
            .clear()
            .type(18)

        cy.get('span').contains('Convergence length:').parent().contains('30.49 mm')
        cy.get('span').contains('Divergence length:').parent().contains('22.09 mm')
        cy.get('span').contains('Nozzle exit diameter:').parent().contains('14.00 mm')
    })
})
