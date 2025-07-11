const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
    console.log('Connected to print server');
    socket.send(
      JSON.stringify({
        business: {
          name: "Demo Store",
          address: "123 Main St, City",
          phone: "0917-123-4567",
          email: "info@demostore.com",
          website: "www.demostore.com",
          tax_id: "TIN-123456789",
          vat_id: "VAT-987654321",
        },
        receipt: {
          cashier: {
            id: "001",
            name: "Jane Doe",
          },
          products: [
            { id: 3, quantity: 2, name: "Apple", sale_price: 25.0 },
            { id: 2, quantity: 1, name: "Banana", sale_price: 15.5 },
            { id: 1, quantity: 3, name: "Orange Juice", sale_price: 45.0 },
          ],
          sc: {
            id: "SC001",
            name: "Senior Citizen",
            address: "456 Elder St, City",
            tin: "SC-TIN-123456",
          },
          total: 201.5,
          discount: 10.0,
          total_payment: 250.0,
          total_change: 48.5,
          total_discount: 10.0,
          total_taxes: 12.0,
          mode_of_payment: "Cash",
          reference_number: "REF123456",
          date_of_sale: "2023-10-01 12:00:00",
          id: "000000000001",
        },
      })
    );
};
socket.onmessage = (event) => {
    console.log('Server says:', event.data);
    socket.close();
};

socket.onerror = (error) => {
    console.error('WebSocket Error:', error);
};
