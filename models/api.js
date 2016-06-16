 $("#getUserById").click(function(){
      var userId = $("#userIdFind").val();
      $.get( "/users", { _id : userId})
        .done(function( data ) {
          $("#data").html(JSON.stringify(data));
        });
    });

    $("#addCite").click(function(){
        var title = $("#title").val();
        var postBy = $("#postBy").val();
         $.post( "/docs", { title: title, postBy: postBy})
          .done(function( data ) {
             $("#data").html(JSON.stringify(data));
      });
    });

    $("#getCite").click(function(){
      var postByFind = $("#postByFind").val();
      var query = { postedBy : postByFind };
      if(!postByFind){
        query = {};
      };
      $.get( "/docs", query )
        .done(function( data ) {
          $("#data").html(JSON.stringify(data));
        });
    });
    $("#getUser").click(function(){
      var token = $("#token").val();
      var nickname = $("#nickname").val();
      var query = { token: token, nickname: nickname };
      if(!token){
        query = {};
      };
      $.get( "/users", query )
        .done(function( data ) {
          $("#data").html( JSON.stringify( data ) );
          $("#knigga").append( JSON.stringify( data ) );
        });
    });

    $("#addUser").click(function(){
      var token = $("#token").val();
      var nickname = $("#nickname").val();
      //alert( "token " + token );
      $.post( "/users", { token: token, nickname: nickname})
        .done(function( data ) {
          $("#data").html(JSON.stringify(data));
          //alert( "Data Loaded: " + data );
        })
        .fail(function(){
          //alert('ti tot eshe hyi');
          $("#data").html('Already exist!!!!!!111111odin');
        });
      });
     $("#delUser").click(function(){
      var id = $("#delToken").val();
      $.ajax({
         url: '/users/'+id,
         type: 'DELETE',
         success: function(data) {
           $("#data").html(data);
         }
      });
    });
     $("#changeUser").click(function(){
      var id = $("#delToken").val();
      var token = $("#token").val();
      var nickname = $("#nickname").val();
      $.ajax({
         url: '/users/'+id,
         type: 'PUT',
         data: { token: token, nickname: nickname},
         success: function(data) {
           $("#data").html(data);
         }
      });
    });


    $("#superUser").click(function(){
      $("#newPole").html("");
      $.get( "/users", {})
      //alert(users);
        .done(function( users ) {
          $("#data").append(JSON.stringify(users));
          users.forEach(function( uitem, ui, users ){
              //alert(item + i);
              $.get("/docs", { postedBy : uitem._id})
              .done(function( docs ) {
                $("#knigga").append( JSON.stringify( docs ) );
                docs.forEach( function( ditem, di, docs)  {
                  $("#newPole").append("nickname: " + uitem.nickname + " " + "doc: " + ditem.title + " ");
              });
              });
          });
          //$("#newPole").html(JSON.stringify(data));
        });

    });
