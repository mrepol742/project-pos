<?php
namespace PrintServer;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Mike42\Escpos\Printer;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

class PrintServer implements MessageComponentInterface
{
    public function onOpen(ConnectionInterface $conn)
    {
        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
        $dotenv->safeLoad();

        try {
            $connector = new WindowsPrintConnector($_ENV['PRINTER_NAME']);
            $printer = new Printer($connector);

            $data = json_decode($msg, true);
            if (json_last_error() !== JSON_ERROR_NONE)
                throw new \Exception("Invalid JSON");

            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH | Printer::MODE_DOUBLE_HEIGHT);
            $printer->text("{$data['business']['name']}\n");
            $printer->selectPrintMode();
            if ($data['business']['address']) $printer->text("{$data['business']['address']}\n");
            if ($data['business']['phone']) $printer->text("{$data['business']['phone']}\n");
            if ($data['business']['email']) $printer->text("{$data['business']['email']}\n");
            if ($data['business']['website']) $printer->text("{$data['business']['website']}\n");
            if ($data['business']['tax_id']) $printer->text("{$data['business']['tax_id']}\n");
            if ($data['business']['vat_id']) $printer->text("{$data['business']['vat_id']}\n");

            $printer->feed();

            $printer->setJustification(Printer::JUSTIFY_LEFT);
            
            $printer->text("POS {$data['receipt']['cashier']['id']}\n");
            $printer->text("Cashier: {$data['receipt']['cashier']['name']}\n");
            $printer->text("Date: " . date('Y-m-d H:i:s') . "\n");

            $qtyWidth = 5;
            $descWidth = 22;
            $amtWidth = 18;

            $qtyHeader = str_pad('QTY', $qtyWidth);
            $descHeader = str_pad('ITEM', $descWidth);
            $amtHeader = str_pad('AMT', $amtWidth, ' ', STR_PAD_LEFT);
            $printer->text("\n{$qtyHeader}{$descHeader}{$amtHeader}\n");

            $totalWidth = $qtyWidth + $descWidth + $amtWidth;
            $printer->text(str_repeat('-', $totalWidth) . "\n");

            foreach ($data['receipt']['products'] as $item) {
                $qty = str_pad($item['quantity'], $qtyWidth);
                $desc = mb_substr($item['name'], 0, $descWidth);
                $desc = str_pad($desc, $descWidth);
                $amt = str_pad(number_format($item['sale_price'], 2), $amtWidth, ' ', STR_PAD_LEFT);
                $printer->text("{$qty}{$desc}{$amt}\n");
            }

            $printer->text(str_repeat('-', $totalWidth) . "\n\n");

            $printer->text(str_pad("Discount:", $totalWidth - $amtWidth) . str_pad(number_format($data['receipt']['discount'], 2), $amtWidth, ' ', STR_PAD_LEFT) . "\n");
            $printer->text(str_pad("Taxes:", $totalWidth - $amtWidth) . str_pad(number_format($data['receipt']['total_taxes'], 2), $amtWidth, ' ', STR_PAD_LEFT) . "\n");
            $printer->text(str_pad("TOTAL:", $totalWidth - $amtWidth) . str_pad(number_format($data['receipt']['total'], 2), $amtWidth, ' ', STR_PAD_LEFT) . "\n");
            $printer->text(str_pad("Payment Received:", $totalWidth - $amtWidth) . str_pad(number_format($data['receipt']['total_payment'], 2), $amtWidth, ' ', STR_PAD_LEFT) . "\n");
            $printer->text(str_repeat('-', $totalWidth) . "\n");
            $printer->text(str_pad("CHANGE:", $totalWidth - $amtWidth) . str_pad(number_format($data['receipt']['total_change'], 2), $amtWidth, ' ', STR_PAD_LEFT) . "\n");
            $printer->feed();
            $printer->text(str_pad("Mode of Payment:", $totalWidth - $amtWidth) . str_pad($data['receipt']['mode_of_payment'], $amtWidth, ' ', STR_PAD_LEFT) . "\n");
            $printer->text(str_pad("Reference Number:", $totalWidth - $amtWidth) . str_pad($data['receipt']['reference_number'], $amtWidth, ' ', STR_PAD_LEFT) . "\n");
            $printer->text(str_pad("Date of Sale:", $totalWidth - $amtWidth) . str_pad($data['receipt']['date_of_sale'], $amtWidth, ' ', STR_PAD_LEFT) . "\n");

            $printer->feed();

            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->text("THIS IS YOUR OFFFICIAL RECEIPT!\n");
            $printer->text("THANK YOU, PLEASE COME AGAIN!\n");
            $printer->feed();

            $printer->setJustification(Printer::JUSTIFY_LEFT);
            if (!empty($data['receipt']['sc'])) {
                $printer->text(str_pad("Customer:", $totalWidth - $amtWidth) . str_pad($data['receipt']['sc']['name'], $amtWidth, ' ', STR_PAD_LEFT) . "\n");
                $printer->text(str_pad("Address:", $totalWidth - $amtWidth) . str_pad($data['receipt']['sc']['address'], $amtWidth, ' ', STR_PAD_LEFT) . "\n");
                $printer->text(str_pad("TIN:", $totalWidth - $amtWidth) . str_pad($data['receipt']['sc']['tin'], $amtWidth, ' ', STR_PAD_LEFT) . "\n");
                $printer->text(str_pad("SC ID No:", $totalWidth - $amtWidth) . str_pad($data['receipt']['sc']['id'], $amtWidth, ' ', STR_PAD_LEFT) . "\n");
            } else {
                $printer->text("Customer: \n");
                $printer->text("Address: \n");
                $printer->text("TIN: \n");
                $printer->text("SC ID No: \n");
            }
            $printer->text("Signature: \n");
            $printer->feed();

            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->text("POS System by:\n");
            $printer->text("{$data['business']['name']}\n");
            if ($data['business']['address']) $printer->text("{$data['business']['address']}\n");
            if ($data['business']['phone']) $printer->text("{$data['business']['phone']}\n");
            if ($data['business']['email']) $printer->text("{$data['business']['email']}\n");
            if ($data['business']['website']) $printer->text("{$data['business']['website']}\n");
            if ($data['business']['tax_id']) $printer->text("{$data['business']['tax_id']}\n");
            if ($data['business']['vat_id']) $printer->text("{$data['business']['vat_id']}\n");

            $printer->feed();

            $printer->text("THIS RECEIPT SHALL BE VALID FOR FIVE (5)\n");
            $printer->text("YEARS FROM THE DATE OF THE TRANSACTION\n");

            $printer->feed(3);

            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->barcode("{A{$data['receipt']['id']}", Printer::BARCODE_CODE128);
            $printer->setJustification(Printer::JUSTIFY_CENTER);
            $printer->text("{$data['receipt']['id']}\n");
            $printer->feed();

            $printer->cut();
            $printer->close();

            $from->send(json_encode([
                'status' => 'success',
                'message' => 'Receipt printed successfully',
                'receipt_id' => $data['receipt']['id'] ?? null
            ]));
        } catch (\Exception $e) {
            echo "Error: " . $e->getMessage() . "\n";
            $from->send(json_encode([
                'status' => 'error',
                'message' => 'Failed to print receipt',
                'error' => $e->getMessage(),
                'receipt_id' => $data['receipt']['id'] ?? null
            ]));
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }
}
