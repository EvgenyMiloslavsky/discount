export interface Trainee {
  id: string,
  name: string,
  email: string,
  date_joined: string,
  address: string,
  city: string,
  country: string,
  zip: string,
  subjects: [{
    name: string,
    grade: string,
    time_over?: string
  }]
}
