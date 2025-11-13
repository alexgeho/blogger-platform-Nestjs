function c() {
  throw new Error('Что-то пошло не так 😅');
}

function b() {
  c();
}

function a() {
  b();
}

a();
