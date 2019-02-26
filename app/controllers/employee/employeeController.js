const Employee = require('../../models/EmployeeSchema')
const responses = require('../../config/responses/responses')

exports.registerEmployee = (req, res, next) => {
    if (req.body.name == undefined || req.body.registration == undefined || 
        req.body.address == undefined || req.body.name == '' || 
        req.body.registration == '' || req.body.address == '') {

        return res.status(responses.BAD_REQUEST).json({
            code: responses.BAD_REQUEST,
            error: "invalid_body_register",
            error_description: "name, registration and address are required"
        })
    }

    let employee = new Employee(req.body)
    employee.status = true

    employee.save()
    .then(result => {
        return res.status(200).json({
            success: true, message: "Funcionario cadastrado com sucesso.", data: result
        })
    })
    .catch(err => {
        console.log(err)
        return res.status(responses.BAD_REQUEST).json({
            code: 400, error: "invalid_insert", error_description: err.message
        })
    })
}

exports.getEmployees = (req, res, next) => {
    Employee.find()
    .populate('route', '-routes -coordinates')
    .then(employees => {
        let list = []

        employees.forEach(employee => {
            let data = {
                id: employee._id,
                status: employee.status,
                name: employee.name,
                registration: employee.registration,
                address: employee.address,
                company: employee.company,
                route: employee.route
            }

            list.push(data)
        })

        return list
    })
    .then(employees => {
        return res.status(responses.OK).json(employees)
    })
}

exports.getEmployee = (req, res, next) => {
    
    let employeeId = req.params.id

    Employee.findById(employeeId)
    .populate('route', '-routes -coordinates')
    .then(employee => {
        let data = {
            id: employee._id,
            status: employee.status,
            name: employee.name,
            registration: employee.registration,
            address: employee.address,
            company: employee.company,
            route: employee.route
        }
        
        return data
    })
    .then(profiles => {
        return res.status(responses.OK).json(profiles)
    })
    .catch(err => {
        return res.status(responses.BAD_REQUEST).json({
            success: false,
            message: "funcionario nao encontrado ou nao existe"
        })
    })
}

exports.updateEmployee = (req, res, next) => {

    let employeeId = req.params.id

    if (req.body.name == undefined ||
        req.body.address == undefined) {
        return res.status(responses.BAD_REQUEST).json({
            code: 400,
            error: "invalid_body_register",
            error_description: "name, registration and address are required"
        });
    }

    Employee.findById(employeeId)
    .then(employee => {
        
        employee.name = req.body.name
        employee.address = req.body.address
        employee.company = req.body.company
        // employee._id = req.body._id
        // employee.status = req.body.status
        // employee.registration = req.body.registration
        
        
        return employee.save()
    })
    .then(newEmployee => {
        console.log(newEmployee)
        return res.status(responses.OK).json({
            success: true,
            message: "registro atualizado com sucesso",
            data: newEmployee
        })
    })
    .catch(err => {
        return res.status(responses.BAD_REQUEST).json({
            success: false,
            message: "funcionario nao encontrado ou nao existe"
        })
    })
}

exports.enableDisableEmployee = (req, res, next) => {
    
    let employeeId = req.params.id

    Employee.findById(employeeId)
    .then(employee => {

        if (employee.status) {
            employee.status = false
        } else {
            employee.status = true
        }
      
        return employee.save()
    })
    .then(disbaleEmployee => {
        // console.log(disbaleEmployee)
        return res.status(responses.OK).json({
            success: true,
            message: disbaleEmployee.status? "funcionario ativado com sucesso" : "funcionario desativado com sucesso",
            data: disbaleEmployee
        })
    })
    .catch(err => {
        console.log(err)
        return res.status(responses.BAD_REQUEST).json({
            success: false,
            message: err.message
        })
    })
}