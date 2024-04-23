import {z} from "@hono/zod-openapi"
import { createRoute } from '@hono/zod-openapi'
import { OpenAPIHono } from '@hono/zod-openapi'
import { Hono } from 'hono'
import { swaggerUI } from '@hono/swagger-ui'


const app = new OpenAPIHono()

const ParamsSchema=z.object({
  id:z.string().min(3).max(10).openapi({
    param:{
      name:"id",
      in:"path"
    },
    example:"123"
  }) 
})


const UserSchema=z.object({
  name:z.string().min(3).max(10).openapi({
    example:"john"
  }),
  age:z.number().int().openapi({
    example:12
  }),
  id:z.string().min(1).max(10).openapi({
    example:"24"
  })

})

const getUserRoute = createRoute({
  method: 'get',
  path: '/users/{id}',
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: 'Retrieve the user',
    },
  },
})

const postUserRoute = createRoute({
  method: 'post',
  path: '/users/{id}',
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: 'Retrieve the user',z
    },
  },
})

app.openapi(getUserRoute, (c) => {
  const { id } = c.req.valid('param')
  return c.json({
    id,
    age: 20,
    name: 'Ultra-man',
  })
})


app.openapi(postUserRoute, (c) => {
  const { id } = c.req.valid('param')
  return c.json({
    id,
    age: 20,
    name: 'Ultra-man',
  })
})

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
})

app.get('/ui', swaggerUI({ url: '/doc' }))
export default app