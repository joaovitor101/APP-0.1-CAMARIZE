import express from 'express';
const router = express.Router();

router.get('/notificacoes', (req, res) => {
  const notifications = [
    { image: "sensor1.png", title: "Aumento na temperatura!", tank: "Tanque 1", time: "14:10" },
    { image: "sensor2.png", title: "Nível de amônia baixo!", tank: "Tanque 1", time: "05:20" },
    { image: "sensor3.png", title: "O pH da água está baixo!", tank: "Tanque 1", time: "01:35" }
  ];
  res.render('notificacoes', { notifications });
});



export default router;
