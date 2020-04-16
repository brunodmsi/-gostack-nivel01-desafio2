const request = require('supertest');
const app = require('../app');
const { isUuid } = require('uuidv4');

describe('Repositories', () => {
  it('should be able to create a new repository', async() => {
    const response = await request(app)
      .post('/repositories')
      .send({
        url: "http://github.com/brunodmsi/Scient",
        title: "Scient",
        techs: ["Node", "React", "JavaScript"]
      });

    expect(isUuid(response.body.id)).toBe(true);

    expect(response.body).toMatchObject({
      url: "http://github.com/brunodmsi/Scient",
      title: "Scient",
      techs: ["Node", "React", "JavaScript"],
      likes: 0
    })
  })

  it('should be able to list the repositories', async() => {
    const repository = await request(app)
      .post('/repositories')
      .send({
        url: "http://github.com/brunodmsi/Scient",
        title: "Scient",
        techs: ["Node", "React", "JavaScript"]
      });

    const response = await request(app).get('/repositories');

    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          id: repository.body.id,
          url: "http://github.com/brunodmsi/Scient",
          title: "Scient",
          techs: ["Node", "React", "JavaScript"],
          likes: 0
        }
      ])
    )
  })

  it('should be able to update repository', async() => {
    const repository = await request(app)
      .post('/repositories')
      .send({
        url: "http://github.com/brunodmsi/Scient",
        title: "Scient",
        techs: ["Node", "React", "JavaScript"]
      });
    
    const response = await request(app)
      .put(`/repositories/${repository.body.id}`)
      .send({
        url: "http://github.com/brunodmsi/Scient",
        title: "Scient - PI",
        techs: ["Node", "React", "JavaScript", "TensorFlow"]
      });

    expect(isUuid(response.body.id)).toBe(true);

    expect(response.body).toMatchObject({
      url: "http://github.com/brunodmsi/Scient",
      title: "Scient - PI",
      techs: ["Node", "React", "JavaScript", "TensorFlow"]
    });
  })

  it('should not be able to update a repository that does not exist', async() => {
    await request(app).put('/repositories/123').expect(400);
  })

  it('should not be able to update repository likes manually', async() => {
    const repository = await request(app)
      .post('/repositories')
      .send({
        url: "http://github.com/brunodmsi/Scient",
        title: "Scient",
        techs: ["Node", "React", "JavaScript"]
      });
    
    const response = await request(app)
      .put(`/repositories/${repository.body.id}`)
      .send({
        likes: 15
      });

    expect(response.body).toMatchObject({
      likes: 0
    })
  })

  it('should be able to delete the repository', async() => {
    const response = await request(app)
    .post('/repositories')
    .send({
      url: "http://github.com/brunodmsi/Scient",
      title: "Scient",
      techs: ["Node", "React", "JavaScript"]
    });
  
    await request(app).delete(`/repositories/${response.body.id}`);

    const repositories = await request(app).get('/repositories');

    const repository = repositories.body.find(r => r.id === response.body.id);

    expect(repository).toBe(undefined);
  });

  it('should not be able to delete a repository that does not exist', async() => {
    await request(app)
      .delete('/repositories/123')
      .expect(400);
  })
})