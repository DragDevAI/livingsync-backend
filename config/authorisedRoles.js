module.exports = {
  "GET /account/": ["admin"],
  "POST /account/signup": ["admin", "owner", "tenant"],
  "GET /account/:id": ["admin", "owner", "tenant"],
  "PUT /account/:id": ["admin", "owner", "tenant"],
  "DELETE /account/:id": ["admin", "owner", "tenant"],

  "GET /unit/": ["admin"],
  "GET /unit/byunitno/:unitno": ["admin", "owner", "tenant"],
  "GET /unit/:id": ["admin", "owner", "tenant"],

  "GET /financial/": ["admin"],
  "GET /financial/byunitno/:unitno": ["admin", "owner", "tenant"],
  "GET /financial/:id": ["admin", "owner"],
  "PUT /financial/:id": ["admin", "owner"],

  "GET /document/": ["admin", "owner", "tenant"],

  "GET /car/": ["admin"],
  "GET /car/byunitno/:unitno": ["admin", "owner", "tenant"],
  "POST /car/": ["admin", "owner", "tenant"],
  "PUT /car/:id": ["admin"],
  "DELETE /car/:id": ["admin"],

  "GET /visitor/": ["admin"],
  "GET /visitor/byunitno/:unitno": ["admin", "owner", "tenant"],
  "GET /visitor/:id": ["admin", "owner", "tenant"],
  "POST /visitor/": ["admin", "owner", "tenant"],
  "PUT /visitor/:id": ["admin"],
  "DELETE /visitor/cleanup": ["admin"],
  "DELETE /visitor/:id": ["admin"],

  "GET /bbq/": ["admin"],
  "GET /bbq/byunitno/:unitno": ["admin", "owner", "tenant"],
  "GET /bbq/:id": ["admin", "owner", "tenant"],
  "POST /bbq/": ["admin", "owner", "tenant"],
  "DELETE /bbq/cleanup": ["admin"],  
  "DELETE /bbq/:id": ["admin"],

  "GET /function/": ["admin"],
  "GET /function/byunitno/:unitno": ["admin", "owner", "tenant"],
  "GET /function/:id": ["admin", "owner", "tenant"],
  "POST /function/": ["admin", "owner", "tenant"],
  "DELETE /function/cleanup": ["admin"],  
  "DELETE /function/:id": ["admin"],

  "GET /renovation/": ["admin"],
  "GET /renovation/byunitno/:unitno": ["admin", "owner"],
  "GET /renovation/:id": ["admin", "owner"],
  "POST /renovation/": ["admin", "owner"],
  "DELETE /renovation/cleanup": ["admin"],  
  "DELETE /renovation/:id": ["admin"],

  "GET /report/": ["admin"],
  "GET /report/byunitno/:unitno": ["admin", "owner", "tenant"],
  "GET /report/:id": ["admin", "owner", "tenant"],
  "POST /report/": ["admin", "owner", "tenant"],
  "PUT /report/:id": ["admin"],
  "DELETE /report/cleanup": ["admin"],  
  "DELETE /report/:id": ["admin"],

};