'use strict'
const Database = use('Database')
const Faculty = use('App/Model/Faculty')
const Lecture = use('App/Model/Lecture')
const UserLecture = use('App/Model/UserLecture')
const User = use('App/Model/User')
const Validator = use('Validator')
const Helpers = use('Helpers')
const fs = use('fs')

class LectureController {
  /**
   *
   */
  * main (request, response) {
    // load all faculties
    const faculties = yield Faculty.all()

    // for each faculty load the last 3 lectures
    for (let faculty of faculties) {
      
      const latestLectures = yield faculty.lectures().orderBy('id', 'desc').limit(3).fetch()
      
      faculty.latestLectures = latestLectures.toJSON()
    }


    yield response.sendView('main', {
      faculties: faculties
        .filter(faculty => faculty.latestLectures.length > 0)
        .toJSON()
    })
  }


  /**
   *
   */
  * index (request, response) {
    const page = Math.max(1, request.input('p'))
    const filters = {
      lectureName: request.input('lectureName') || '',
      faculty: request.input('faculty') || 0
    }

    const lectures = yield Lecture.query()
      .where(function () {
        if (filters.faculty > 0) this.where('faculty_id', filters.faculty)
        if (filters.lectureName.length > 0) this.where('name', 'LIKE', `%${filters.lectureName}%`)
      })

      .paginate(page, 9)

    const faculties = yield Faculty.all()
    const users = yield User.all()

    yield response.sendView('lectures', {
      lectures: lectures.toJSON(),
      faculties: faculties.toJSON(),
      users: users.toJSON(),
      filters
    })
  }

 /**
   *
   */
  * myLectures (request, response) {
    const page = Math.max(1, request.input('p'))
    
    const myLecturesId = yield UserLecture.query()
      .where({'user_id': request.currentUser.id})
      .select('lecture_id')
      .paginate(page,9)

    var myLectures = []  
      for (let lectureId of myLecturesId) {
      const lecture = yield Lecture.find(lectureId.lecture_id)

      myLectures.push(lecture)
    }

    

    yield response.sendView('my_lectures', {
      myLectures: myLectures,
     
    })
  }

  /**
   *
   */
  * create (request, response) {
    const faculties = yield Faculty.all()


    yield response.sendView('lecture_create', { faculties: faculties.toJSON() })
  }

  /**
   *
   */
  * doCreate (request, response) {
    const lectureData = request.all()
    const validation = yield Validator.validateAll(lectureData, {
      name: 'required',
      faculty: 'required',
      place: 'required',
      time: 'required',
      max: 'required',
    })

    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({ errors: validation.messages() })
        .flash()

      response.route('lecture_create')
	  return;
    }
    const faculty = yield Faculty.find(lectureData.faculty)

    if (!faculty) {
      yield request
        .withAll()
        .andWith({ errors: [{ message: 'Faculty doesn\'t exist' }] })
        .flash()

      response.route('lecture_create')
	  return;
    }
	
   
    const lecture = new Lecture()
    lecture.name = lectureData.name
    lecture.place = lectureData.place
    lecture.time = lectureData.time
    lecture.max = lectureData.max
    lecture.faculty_id = lectureData.faculty
    yield lecture.save()

   response.route('lecture_page', { id: lecture.id })
  }

  /**
   *
   */
  * show (request, response) {
    const lectureId = request.param('id')
    const lecture = yield Lecture.find(lectureId)
    const faculty = yield Faculty.find(lecture.faculty_id);
    const takedClass = yield Database
      .table('user_lectures')
      .where({'user_id': request.currentUser.id,'lecture_id': lectureId})
      .select('id')
    
    const usersTakedLecture = yield Database
      .table('user_lectures')
      .where({'lecture_id': lectureId})
      .select('user_id')

    var users = []  
    for (let userId of usersTakedLecture) {
      const user = yield User.find(userId.user_id)
      users.push(user)

    }

    if (lecture) {
      yield response.sendView('lecture', { lecture: lecture.toJSON(),faculty : faculty,takedClass : takedClass, users : users })
    } else {
      response.notFound('Lecture not found.')
    }
  }

  /**
   *
   */
  * edit (request, response) {
    const lectureId = request.param('id')
    const lecture = yield Lecture.find(lectureId)
    
	
    if (!lecture) {
	  yield response.notFound('Lecture not found.')
	  return;
    } 
	
    if (request.currentUser.isadmin != "true") {
      response.unauthorized('Access denied.')
    }

    console.log(lecture.faculty_id)
    const faculties = yield Faculty.all()

    yield response.sendView('lecture_edit', { faculties: faculties.toJSON(), lecture: lecture.toJSON() })
  }

  /**
   *
   */
  * doEdit (request, response) {
    const lectureId = request.param('id')
    const lecture = yield Lecture.find(lectureId)

    if (!lecture ) {
	  yield response.notFound('Lecture not found.')
	  return;
    } 
	
    if (request.currentUser.isadmin != "true") {
      response.unauthorized('Access denied.')
    }
	  
    const lectureData = request.all()
     const validation = yield Validator.validateAll(lectureData, {
      name: 'required',
      faculty: 'required',
      place: 'required',
      time: 'required',
      max: 'required',
    })

    if (validation.fails()) {
      yield request
        .with({ errors: validation.messages() })
        .flash()

      yield response.route('lecture_edit', {id: lecture.id})
	  return;
    } 
    const faculty = yield Faculty.find(lectureData.faculty)

    if (!faculty) {
      yield request
        .withAll()
        .andWith({ errors: [{ message: 'Faculty doesn\'t exist' }] })
        .flash()

       yield response.route('lecture_edit', {id: lecture.id})
	  return;
    }
  

    lecture.name = lectureData.name
    lecture.place = lectureData.place
    lecture.time = lectureData.time
    lecture.max = lectureData.max
    lecture.faculty_id = lectureData.faculty

    yield lecture.update()

    response.route('lecture_page', { id: lecture.id })
    
  }

  /**
   *
   */
  * doDelete (request, response) {
    const lectureId = request.param('id')
    const lecture = yield Lecture.find(lectureId)

    if (lecture) {
      if (request.currentUser.isadmin != "true") {
      response.unauthorized('Access denied.')
     }

      yield lecture.delete()

      response.route('main')
    } else {
      response.notFound('Lecture not found.')
    }
  }


/**
   *
   */
  * assignLecture (request, response) {
    const lectureId = request.param('id')
    const lecture = yield Lecture.find(lectureId)

    if (lecture) {
     
     const userLecture = new UserLecture()   
    
     userLecture.user_id = request.currentUser.id
     userLecture.lecture_id = lectureId

     yield userLecture.save()

      response.route('lecture_page', { id: lecture.id })
    } else {
      response.notFound('Lecture not found.')
    }
  }


 * ajaxAssignLecture (request, response) {
    const lectureId = request.param('id')
    const lecture = yield Lecture.find(lectureId)

    if (lecture) {
     
     const userLecture = new UserLecture()   
    
     userLecture.user_id = request.currentUser.id
     userLecture.lecture_id = lectureId

     yield userLecture.save()

      response.send({ success: true })
    } else {
      response.send({ success: false })
    }
  }

/**
   *
   */
  * dropLecture (request, response) {
    const lectureId = request.param('id')
    const userId = request.param('user_id')
    const lecture = yield Lecture.find(lectureId)

    

    if (lecture) {
    var userLectureId = []
    if(userId != null) {
        userLectureId = yield Database
      .table('user_lectures')
      .where({'user_id': userId,'lecture_id': lectureId})
      .select('id')

    } else {
      userLectureId = yield Database
      .table('user_lectures')
      .where({'user_id': request.currentUser.id,'lecture_id': lectureId})
      .select('id')
    }

    if(userLectureId.length > 0) {
      const userLecture = yield UserLecture.find(userLectureId[0].id)

      yield userLecture.delete()
    } else {
      response.notFound('Lecture assign not found.')

    }


      response.route('lecture_page', { id: lecture.id })
    } else {
      response.notFound('Lecture not found.')
    }
  }

 * ajaxDropLecture(request, response) {
    const lectureId = request.param('id')
    const userId = request.param('user_id')
    const lecture = yield Lecture.find(lectureId)
     if (lecture) {
      var userLectureId = []
      if(userId != null) {
          userLectureId = yield Database
        .table('user_lectures')
        .where({'user_id': userId,'lecture_id': lectureId})
        .select('id')

      } else {
        userLectureId = yield Database
        .table('user_lectures')
        .where({'user_id': request.currentUser.id,'lecture_id': lectureId})
        .select('id')
      }

      if(userLectureId.length > 0) {
        const userLecture = yield UserLecture.find(userLectureId[0].id)

        yield userLecture.delete()
        response.send({ success: true })
        return
      } else {
        response.send({ success: false })
        return
      }

    } else {
     response.send({ success: false })
     return
    }
       
  }


}

function fileExists(fileName) {
  return new Promise((resolve, reject) => {
    fs.access(fileName, fs.constants.F_OK, err => {
      if (err) resolve(false)
      else resolve(true)
    })
  })
}

module.exports = LectureController
