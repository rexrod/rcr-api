const EmployeeRoute = require('../../models/EmployeeRoutes')
const Transport = require('../../models/TransportSchema')

exports.registerRoute = (req, res, next) => {

    let transportId = req.params.id

    if (req.body.employees == undefined || req.body.employees == '') {
        return res.status(responses.BAD_REQUEST).json({
            code: responses.BAD_REQUEST,
            error: "invalid_body_register",
            error_description: "Employees are required"
        })
    }

    let employees = req.body.employees
    let newRoute = new EmployeeRoute()

    employees.forEach(employee => {
        newRoute.employees.push(employee)
    });

    newRoute.save()
    .then(route => {
        Transport.findById(transportId)
        .then(transport => {
            transport.routes = route._id
            return transport.save()
        })
    })
    .then(result => {
        return res.status(200).json({
            success: true, message: "rota cadastrada com sucesso", data: result
        })
    })

}