// Асинхронная функция для получения текущего IP-адреса
export async function getCurrentIp() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Ошибка при получении текущего IP:', error);
      return null;
    }
  }
  
  // Функция для поиска местоположения по IP-адресу
  export async function findLocation(ip) {
    const url = `https://ipapi.co/${ip || 'myip'}/json/`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при запросе:', error);
      return null;
    }
  }