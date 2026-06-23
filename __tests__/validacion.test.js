describe('Validacion de titulo', () => {
  it('titulo vacio debe ser invalido', () => {
    const titulo = '';
    const isValid = titulo.trim().length > 0;
    expect(isValid).toBe(false);
  });

  it('titulo solo con espacios debe ser invalido', () => {
    const titulo = '   ';
    const isValid = titulo.trim().length > 0;
    expect(isValid).toBe(false);
  });

  it('titulo con contenido debe ser valido', () => {
    const titulo = 'Comprar leche';
    const isValid = titulo.trim().length > 0;
    expect(isValid).toBe(true);
  });

  it('titulo con espacios al inicio y final debe ser valido', () => {
    const titulo = '  Comprar leche  ';
    const tituloFormateado = titulo.trim();
    expect(tituloFormateado).toBe('Comprar leche');
    expect(tituloFormateado.length > 0).toBe(true);
  });
});

describe('Formateo de fecha', () => {
  it('toISOString().split("T")[0] produce formato YYYY-MM-DD', () => {
    const date = new Date('2025-07-15T12:00:00.000Z');
    const dateStr = date.toISOString().split('T')[0];
    expect(dateStr).toBe('2025-07-15');
  });

  it('fecha YYYY-MM-DD valida pasa el regex', () => {
    const dateStr = '2025-07-15';
    const isValid = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
    expect(isValid).toBe(true);
  });

  it('fecha en formato incorrecto falla el regex', () => {
    expect(/^\d{4}-\d{2}-\d{2}$/.test('15-07-2025')).toBe(false);
    expect(/^\d{4}-\d{2}-\d{2}$/.test('2025/07/15')).toBe(false);
    expect(/^\d{4}-\d{2}-\d{2}$/.test('julio 2025')).toBe(false);
  });

  it('fecha null o vacia es falsy para if (fechaEvento)', () => {
    expect(null).toBeFalsy();
    expect('').toBeFalsy();
    expect(undefined).toBeFalsy();
    expect('2025-07-15').toBeTruthy();
  });
});