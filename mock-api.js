const express = require('express');
const cors = require('cors');

const port = 3002;
const app = express();
app.options('*', cors());
app.use(cors());
app.use(express.json());

const live_stream_prefix = '/api/live-stream-merchant';

const listProduct = [];
const listOrder = [];

app.get('/test', (req, res) => {
  for (let i = 0; i < 30; i += 1) {
    const data = {
      delivery_address: {
        address: `23${i} Phan Văn Hân`,
        id: 30 + i,
        name: `User ${i + 1}`,
        phone_number: `096323471${i}`,
        user_id: 30 + i,
      },
      delivery_address_id: 30 + i,
      details: [
        {
          cart_id: 22,
          id: i + 1,
          product: [
            {
              id: i + 1,
              name: `Test product ${i + 1}`,
              origin_price: 10,
              price: 10,
              quantity: 0,
              slug: 'sp3',
              status: 1,
              thumbnail: 'string',
            },
          ],
          product_id: i + 1,
          quantity: 15,
          unit_price: 10,
        },
      ],
      id: i,
      live_stream_id: 99,
      total_price: 70000200,
      user: {
        avatar: 'https://filer.vipn.net/file/images/1c143c/png',
        id: i,
        name: '+84******000',
      },
      user_id: i,
    };

    listOrder.push(data);
  }
  res.send('Hello World!');
});

app.get('/items', (req, res) => {
  const data = {
    code: 200,
    data: {
      current_page: 1,
      data: [
        {
          id: 1,
          name: 'item 1',
        },
        {
          id: 2,
          name: 'item 2',
        },
        {
          id: 3,
          name: 'item 3',
        },
        {
          id: 4,
          name: 'item 4',
        },
      ],
      total: 10,
    },
    errors: null,
    msg: '',
    success: true,
  };

  res.send(data);
});

// live stream product
app.get(`${live_stream_prefix}/products`, (req, res) => {
  const data = {
    code: 200,
    data: {
      current_page: 1,
      data: listProduct,
      total: listProduct.length,
    },
    errors: null,
    msg: '',
    success: true,
  };

  res.send(data);
});

app.post(`${live_stream_prefix}/products`, (req, res) => {
  const requestBody = req.body;

  const indexProduct = listProduct.findIndex(
    (obj) => obj.id === requestBody.id,
  );

  const data = {
    code: 200,
    data: [],
    errors: null,
    msg: '',
    success: true,
  };

  if (indexProduct < 0) {
    const newData = {
      id: requestBody.id,
      src: requestBody.thumbnail,
      qty_order: 0,
      qty_total: requestBody.qty_total,
      out_stock: false,
      pause: false,
    };

    data.data = newData;
    data.msg = 'Add product success!!!';

    listProduct.push(newData);
  } else {
    data.data = [];
    data.code = 503;
    data.msg = 'Product exits in livestream!!!';
  }

  res.send(data).status(data.code);
});

app.delete(`${live_stream_prefix}/products/:id`, (req, res) => {
  const { id } = req.params;

  const indexProduct = listProduct.findIndex((obj) => obj.id === Number(id));

  const data = {
    code: 200,
    data: [],
    errors: null,
    msg: '',
    success: true,
  };

  if (indexProduct > -1) {
    listProduct.splice(indexProduct, 1);
    data.msg = 'Remove product success!!!';
  } else {
    data.code = 400;
    data.msg = 'Can not find product!!!';
  }

  res.send(data).status(data.code);
});

app.put(`${live_stream_prefix}/products/:id/status`, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const indexProduct = listProduct.findIndex((obj) => obj.id === Number(id));

  const data = {
    code: 200,
    data: [],
    errors: null,
    msg: '',
    success: true,
  };

  if (indexProduct > -1) {
    if (status === 1) {
      listProduct[indexProduct].out_stock = false;
    }

    if (status === 2) {
      listProduct[indexProduct].out_stock = true;
    }

    data.msg = 'Change status product success!!!';
  } else {
    data.code = 400;
    data.msg = 'Can not find product!!!';
  }

  res.send(data).status(data.code);
});

// live stream order
app.get(`${live_stream_prefix}/cart/:id`, (req, res) => {
  const { id } = req.params;
  const { page, limit } = req.query;

  let limitPage = 10;
  let startPage = 1;

  if (limit) {
    limitPage = Number(limit);
  }

  if (page) {
    startPage = Number(page);
  }

  const totalPage = listOrder.length;
  const lastPage = Math.ceil(totalPage / limit);

  const startIndex = startPage * limitPage - limitPage;
  const endIndex = startPage * limit;

  const responseData = listOrder.slice(startIndex, endIndex);

  const data = {
    code: 200,
    data: {
      current_page: startPage,
      data: responseData,
      first_page_url: `${live_stream_prefix}/cart/${id}?page=1`,
      from: 1,
      last_page: lastPage,
      last_page_url: `${live_stream_prefix}/cart/${id}?page=${lastPage}`,
      next_page_url: null,
      path: `${live_stream_prefix}/cart/${id}`,
      per_page: limit,
      prev_page_url: null,
      to: lastPage,
      total: totalPage,
    },
    errors: null,
    msg: '',
    success: true,
  };

  res.send(data);
});

app.post(`${live_stream_prefix}/order/:id`, (req, res) => {
  const { id } = req.params;

  const indexProduct = listOrder.findIndex((obj) => obj.id === Number(id));

  const data = {
    code: 200,
    data: [],
    errors: null,
    msg: '',
    success: true,
  };

  if (indexProduct > -1) {
    listOrder.splice(indexProduct, 1);
    data.msg = 'Approve cart success!!!';
  } else {
    data.code = 400;
    data.msg = 'Can not find cart!!!';
  }

  res.send(data).status(data.code);
});

app.post(`${live_stream_prefix}/order/:id/reject`, (req, res) => {
  const { id } = req.params;

  const indexProduct = listOrder.findIndex((obj) => obj.id === Number(id));

  const data = {
    code: 200,
    data: [],
    errors: null,
    msg: '',
    success: true,
  };

  if (indexProduct > -1) {
    listOrder.splice(indexProduct, 1);
    data.msg = 'Reject cart success!!!';
  } else {
    data.code = 400;
    data.msg = 'Can not find cart!!!';
  }

  res.send(data).status(data.code);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
