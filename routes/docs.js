var express = require('express');
var router = express.Router({mergeParams : true});
var multer = require('multer');
var PDFdocument = require ('pdfkit');
var Doc = require(__base + 'models/doc.js');
var crypto = require('crypto');
var fs = require('fs');
var officegen = require('officegen');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = './uploads/' + req.params.uid;
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
      console.log('Not exists. Creating directiory');
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    console.log(file.fieldname + '-' + Date.now());
    cb(null, file.fieldname + '-' + Date.now());
  }
})

router.get('/', function(req, res, next) {
  var date = new Date();
  fs.appendFile("./log" + date.getDate() + date.getMonth() + ".txt", 'called route /docs for GET by user ' + req.params.uid + '\r\n' + 'date is: ' + date +'\r\n' + 'with ip = ' + req.ip, function(err) {});
  Doc.find({postedBy : req.params.uid}, function(err, docs){
    if (err) {
      next(err);
    } else {
      res.send(docs);                                                                             
    }
  });
});

router.delete('/:did', function(req, res, next) {
  var date = new Date();
  fs.appendFile("./log" + date.getDate() + date.getMonth() + ".txt", 'called route /docs for GET by user ' + req.params.uid + '\r\n' + 'date is: ' + date +'\r\n' + 'with ip = ' + req.ip, function(err) {});
  Doc.remove({_id : req.params.did}, function(err, docs){
    if (err) {
      next(err);
    } else {
      res.sendStatus(200);                                                                             
    }
  });
});

router.post('/', function(req,res, next) {
  var date = new Date();
  //console.log('called route /docs for POST' + '\n' + 'date is: ' + date +'\n' + 'with ip = ' + req.ip);
  fs.appendFile("./log" + date.getDate() + date.getMonth() + ".txt", 'called route /docs for POST by user ' + req.params.uid + '\r\n' + 'date is: ' + date +'\r\n' + 'with ip = ' + req.ip, function(err) {});
  var doc = new Doc({
    postedBy: req.params.uid,
    title: req.body.title,
    creator: req.body.creator,
    subject: req.body.subject,
    description: req.body.description,
    publisher: req.body.publisher,
    contributor: req.body.contributor,
    date: req.body.date,
    type: req.body.type,
    format: req.body.format,
    source: req.body.source,
    language: req.body.language,
    relation: req.body.relation,
    coverage: req.body.coverage,
    rights: req.body.rights,
  })
  doc.save(function(err, doc) {
    if (err) {
      //console.log(err);
      next(err);
    } else {
      res.send(doc);
    }
  });
});

router.get('/:did', function(req, res, next) {
  var date = new Date();
  //console.log('called route /docs/:id for GET' + '\n' + 'date is: ' + date +'\n' + 'with ip = ' + req.ip);
  fs.appendFile("./log" + date.getDate() + date.getMonth() + ".txt", 'called route /docs for GET by user ' + req.params.uid + '\r\n' + 'date is: ' + date +'\r\n' + 'with ip = ' + req.ip, function(err) {});
  
  Doc.find( {_id : req.params.did, postedBy : req.params.uid }, function(err, docs){
    if (err) {
      next(err);
    } else {
      res.send(docs);
    }
  });
});

router.put('/:did', function(req, res, next) {
  var date = new Date();
  //console.log('called route /users/:id for PUT' + '\n' + 'date is: ' + date +'\n' + 'with ip = ' + req.ip);
  fs.appendFile("./log" + date.getDate() + date.getMonth() + ".txt", 'called route /docs for UPDATE by user ' + req.params.uid + '\r\n' + 'date is: ' + date +'\r\n' + 'with ip = ' + req.ip, function(err) {});
  Doc.update({_id: req.params.did}, { $set : {postedBy: req.params.uid,
    title: req.body.title,
    creator: req.body.creator,
    subject: req.body.subject,
    description: req.body.description,
    publisher: req.body.publisher,
    contributor: req.body.contributor,
    date: req.body.date,
    type: req.body.type,
    format: req.body.format,
    source: req.body.source,
    language: req.body.language,
    relation: req.body.relation,
    coverage: req.body.coverage,
    rights: req.body.rights,}}, function(err) { 
    if (err) {
      next(err);
    } else {
      res.send('ok');
    }
  });
});

router.get('/:did/bibtex', function(req, res, next) {
  var date = new Date();
  fs.appendFile("./log" + date.getDate() + date.getMonth() + ".txt", 'called route /bibtex by user ' + req.params.uid + '\r\n' + 'date is: ' + date +'\r\n' + 'with ip = ' + req.ip, function(err) {});
  Doc.find({_id : req.params.did, postedBy : req.params.uid}, function(err, docs){
    if (err) {
      res.send(404, 'User or document not found');
      next(err);
    } else {
      var meta = docs;                                                                         
    }
    console.log(meta[0]);
    switch(meta[0].type) {
      case 'book' : {
        fs.writeFile(meta[0]._id + '.bib', 
        '@BOOK{' + meta[0].title + ':' + meta[0]._id + ',\r\n' +
          'author = {' + meta[0].creator + '}, \r\n' +
          'title = {' + meta[0].title + '},\r\n' +
          'publisher = {' + meta[0].publisher + '},\r\n' +
          'year = {' + meta[0].date.getFullYear() + '},\r\n' +
          'language = {' + meta[0].language + '}, \r\n' +
        '}'
        , function(err) {
          if(err) {
            res.sendStatus(500);
          } else {
            res.sendFile(meta[0]._id + '.bib', {root : global.__base}, function(err) {} );
          }
        });  
      };
      break;
      case 'article' : {
        fs.writeFile(meta[0]._id + '.bib', 
        '@ARTICLE{' + meta[0].title + ':' + meta[0]._id + ',\r\n' +
          'author = {' + meta[0].creator + '},\r\n' + 
          'title = {' + meta[0].title + '},\r\n' +
          'journal = {' + meta[0].relation + '},\r\n' +
          'year = {' + meta[0].date.getFullYear() + '},\r\n' +
          'month = {' + meta[0].date.getMonth() + '},\r\n' +
          'note = {' + meta[0].description + '},\r\n' +
        '}'
        , function(err) {
          if (err) {
            res.sendStatus(500);
          } else {
            res.sendFile(meta[0]._id + '.bib', {root : global.__base}, function(err) {} );
          }
        });
      };
      break;
      case 'manual' : {
        fs.writeFile(meta[0]._id + '.bib',
          '@MANUAL{' + meta[0].title + ':' + meta[0]._id + ',\r\n' +
            'title = {' + meta[0].title + '},\r\n' +
            'author = {' + meta[0].creator + '},\r\n' +
            'publisher = {' + meta[0].publisher + '},\r\n' +
            'month = {' + meta[0].date.getMonth() + '},\r\n' +
            'year = {' + meta[0].date.getFullYear() + '},\r\n' +
            'note = {' + meta[0].description + '},\r\n' +
          '}'
          , function(err){
            if (err) {
              res.sendStatus(500);
            } else {
              res.sendFile(meta[0]._id + '.bib', {root : global.__base}, function(err) {} );
            }
          });
      };
      break;
      case 'misc' : {
        fs.writeFile(meta[0]._id + '.bib',
          '@MISC{' + meta[0].title + ':' + meta[0]._id + ',\r\n' +
            'title = {' + meta[0].title + '},\r\n' +
            'author = {' + meta[0].creator + '},\r\n' +
            'coverage = {' + meta[0].coverage + '},\r\n' +
            'month = {' + meta[0].date.getMonth() + '},\r\n' +
            'year = {' + meta[0].date.getFullYear() + '},\r\n' +
            'note = {' + meta[0].description + '},\r\n' +
          '}'
          , function(err){
            if (err) {
              res.sendStatus(500);
            } else {
              res.sendFile(meta[0]._id + '.bib', {root : global.__base}, function(err) {} );
            }
          });
      };
      break;        
    };
  });
});

router.get('/:did/pdf', function(req, res, next) {
  var date = new Date();
  var doc = new PDFdocument;
  
  fs.appendFile("./log" + date.getDate() + date.getMonth() + ".txt", 'called route /bibtex by user ' + req.params.uid + '\r\n' + 'date is: ' + date +'\r\n' + 'with ip = ' + req.ip, function(err) {});

  Doc.find({_id : req.params.did, postedBy : req.params.uid}, function(err, docs){
    if (err) {
      res.send(404, 'User or document not found');
      next(err);
    } else {
      
      var meta = docs;
      console.log(docs);
      //res.send(docs);   

      var stream = doc.pipe(fs.createWriteStream(global.__base + 'uploads/' + req.params.did + '.pdf'));

      stream.on('finish', function() {
        res.redirect('/uploads/' + req.params.did + '.pdf');        
      })

      var textPdf = meta[0].creator + ', ' + meta[0].title + ', ' + meta[0].publisher + ', ' + meta[0].date.getFullYear() + '[' + meta[0].source + ']';
      doc.font(global.__base + 'fonts/times.ttf');
      doc.fontSize(14);
      doc.text(textPdf);
      doc.end();                          
    }
  });

});

router.get('/:did/docx', function(req, res, next) {
  var date = new Date();
  var doc = new PDFdocument;
  
  fs.appendFile("./log" + date.getDate() + date.getMonth() + ".txt", 'called route /bibtex by user ' + req.params.uid + '\r\n' + 'date is: ' + date +'\r\n' + 'with ip = ' + req.ip, function(err) {});

  Doc.find({_id : req.params.did, postedBy : req.params.uid}, function(err, docs){
    if (err) {
      res.send(404, 'User or document not found');
      next(err);
    } else {
      var meta = docs;
      console.log(docs);
     
      var docx = officegen('docx');

      var textDoc = meta[0].creator + ', ' + meta[0].title + ', ' + meta[0].publisher + ', ' + meta[0].date.getFullYear() + '[' + meta[0].source + ']';     
      
      docx.setDocTitle(req.params.did + '.docx'); 

      var object = docx.createP();
      object.options.align = 'jestify';
      object.addText(textDoc, {font_face : 'Times New Roman', font_size : 14});

      var stream = fs.createWriteStream(global.__base + 'uploads/' + req.params.did + '.docx');
      docx.generate(stream, function() {});

      stream.on('finish', function(){
        console.log('here');
        res.redirect('/uploads/' + req.params.did + '.docx');
      });    
    }
  });
  
});

router.post('/:did/upload', multer({ storage: storage }).single('attachment'), function(req, res, next)  {
  console.log(req.file);
  res.send(req.file);
});

module.exports = router;