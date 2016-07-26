module.exports = function( connect, middlewares ) {
    var items = [];
    var item_id = 0;
    var find_index_by_id = function( id ) {
        for( var i in items ) {
            if ( items[i].id == id ) return i;
        }
        return -1;
    }
    var find_by_id = function( id ) {
        var i = find_index_by_id( id );
        return i != -1 ? items[i] : null;
    }
    middlewares.push(
            connect().use('/api/v1/todo',function( req, res, next ) {
                res.setHeader('Content-Type','application/json');
                var id = null;
                if ( req.url.match(/\d+/) != null) {
                    id = parseInt( req.url.replace("/",""));
                }
                if ( req.method =='GET' ) {
                    if ( id != null ) {
                        var item = find_by_id( id );
                        res.end(JSON.stringify(items));
                    } else {

                       res.end(JSON.stringify(items));
                    }
                }
                if ( req.method == 'POST' ) {
                    var body = '';
                    req.on('data', function(data) {body+=data});
                    req.on('end', function() {
                        item_id++;
                        var obj = JSON.parse( body );
                        obj.id = item_id;
                        if ( id != null ) {
                            var item = find_by_id( id );
                            item.text = obj.text;
                        } else {
                            items.push( obj );
                        }
                    res.end(JSON.stringify(items));
                });
            }
                if( req.method == 'DELETE' ) {
                    if( id != null ) {
                        var ind = find_index_by_id( id );
                        items.splice(ind, 1);
                        res.end(JSON.stringify(items));
                    }
                }
        })
    );
    return middlewares;
}
