export const BACKEND_URL = process.env.NODE_ENV === 'production' ?
  'http://ec2-54-218-83-41.us-west-2.compute.amazonaws.com' :
  'http://localhost:8080'

export const INVISIBLE_COLOR = 'rgb(155,126,112)'
export const IDENTIFIABLE_COLOR = 'rgb(101,167,217)'
export const DELIVERABLE_COLOR = 'rgb(162,195,95)'
