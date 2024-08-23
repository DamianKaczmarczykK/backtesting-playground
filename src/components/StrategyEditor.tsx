import { Show, createSignal } from "solid-js";
import { Broker, MarketData, Strategy, runBacktesting } from "./BacktestingEngine";
import Editor from "./Editor";
import { MarketDataSelection, addMarketData, backtestingOptions, marketDatas, selectedMarketData, setBacktestingOptions, setSelectedMarketData, strategyCode } from "./EditorStore";
import { Button } from "./ui/button";
import { NumberField, NumberFieldDecrementTrigger, NumberFieldDescription, NumberFieldIncrementTrigger, NumberFieldInput, NumberFieldLabel } from "./ui/number-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import Chart from "./Chart";
import { detectCurrencySymbols, parseYahooCsv } from "./DataImporter";
import { TextField, TextFieldInput, TextFieldLabel } from "./ui/text-field";
import { Indicators } from "~/services/Indicators";
import { showToast } from "./ui/toast";

export function StrategyEditor(props: any) {

  // === Data Importing ===
  const [importedData, setImportedData] = createSignal<MarketDataSelection | null>(null);
  const [dialogOpen, setDialogOpen] = createSignal(false);

  return (
    <div class="flex">

      <div class="w-3/4">
        <Editor />
      </div>

      <div class="w-1/4 mx-8">
        { /**  FIX: add validation error on empty selection and add description */}
        <div class="flex flex-col w-full py-4">
          <h2 class="text-xl font-bold mb-4">Import market data</h2>
          <Select
            options={marketDatas()}
            value={selectedMarketData()}
            onChange={(option) => { console.log(option); setSelectedMarketData(option); }}
            optionTextValue="label"
            optionValue="label"
            optionDisabled="disabled"
            placeholder="Select market data"
            itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue.label}</SelectItem>}
          >
            <SelectTrigger aria-label="Market data">
              <SelectValue<MarketDataSelection>>{(state) => state.selectedOption().label}</SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>

          <Button onClick={() => setDialogOpen(true)}>Import csv</Button>

          <Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
            <DialogTrigger></DialogTrigger>
            <DialogContent class="max-w-6xl max-h-2xl">
              <DialogHeader>
                <DialogTitle>Import market data</DialogTitle>
                <DialogDescription><p>Select csv file in <a class="font-bold text-blue-700" href="https://finance.yahoo.com/quote/BTC-USD/history/">Yahoo Finance</a> format:</p>
                  <p>[<b>Time</b>, <b>Open</b>, <b>High</b>, <b>Low</b>, <b>Close</b>, <b>AdjClose</b>, <b>Volume</b>]</p><br />
                  <p>Example <a
                    class="font-bold text-blue-700"
                    href="https://finance.yahoo.com/quote/BTC-USD/history/">BTC-USD</a>
                  </p>
                </DialogDescription>
              </DialogHeader>

              <input
                type="file"
                id="market-data-input"
                onChange={(e: any) => {
                  const selectedFile: File = e.currentTarget.files[0];

                  if (selectedFile === undefined) {
                    e.currentTarget.value = ''
                    console.error(`Unexpected error in file selection: ${e}`)
                    showToast({ title: `Import error`, variant: "destructive", description: `Unexcepted error during file loading: ${e}` })
                  } else if (!selectedFile.name.endsWith('.csv')) {
                    e.currentTarget.value = ''
                    console.error(`Wrong file extension: ${selectedFile.name}`)
                    showToast({ title: `Import error`, variant: "destructive", description: `Wrong file extension for ${selectedFile.name}` })
                  } else {
                    const reader = new FileReader();
                    reader.readAsText(selectedFile, "UTF-8");
                    reader.onload = function(evt) {
                      const [candleData, err] = parseYahooCsv(evt.target.result);
                      if (err !== null) {
                        console.error(err);
                        showToast({ title: `Import error`, variant: "destructive", description: `Importing ${selectedFile.name} result with error: ${err}` })
                        return;
                      }
                      const [valueSymbol, baseSymbol] = detectCurrencySymbols(selectedFile.name)
                      console.log(candleData);
                      setImportedData({
                        label: selectedFile.name,
                        valueSymbol: valueSymbol,
                        baseSymbol: baseSymbol,
                        value: candleData,
                        disabled: false
                      });
                    }
                    reader.onerror = function(evt) {
                      // TODO: implement error handling for file reading
                      console.error("Error reading file");
                    }
                  }
                }
                }>Select file...</input>

              <Show when={importedData()}>
                <Chart marketData={importedData()?.value} />

                <TextField value={importedData()?.valueSymbol} onChange={(value) => setImportedData(marketDataSelection => {
                  return {
                    ...marketDataSelection!,
                    valueSymbol: value
                  }
                })}>
                  <TextFieldLabel>*Value symbol (crypto, stocks)</TextFieldLabel>
                  <TextFieldInput placeholder="e.g. APPLE" />
                </TextField>

                <TextField value={importedData()?.baseSymbol} onChange={(value) => setImportedData(marketDataSelection => {
                  return {
                    ...marketDataSelection!,
                    baseSymbol: value
                  }
                })}>
                  <TextFieldLabel>*Base symbol (currency of profit)</TextFieldLabel>
                  <TextFieldInput placeholder="e.g. USD" />
                </TextField>
              </Show>

              <Button
                disabled={importedData() === null}
                onClick={() => {
                  addMarketData(importedData()!);
                  setSelectedMarketData(importedData()!);
                  setImportedData(null);
                  setDialogOpen(false);
                  showToast({ title: `Import success`, variant: "success", description: `${selectedMarketData().label} successfully imported` })
                }
                }
              >Import</Button>

            </DialogContent>
          </Dialog>
        </div>



        <div class="flex flex-col py-4">
          <h2 class="text-xl font-bold mb-4">Settings</h2>
          <NumberField
            defaultValue={backtestingOptions.initialBalance}
            onRawValueChange={(value) => setBacktestingOptions({ ...backtestingOptions, initialBalance: value })}
            minValue={0}>
            <NumberFieldLabel>Initial balance</NumberFieldLabel>
            <div class="relative">
              <NumberFieldInput />
              <NumberFieldIncrementTrigger />
              <NumberFieldDecrementTrigger />
            </div>
            <NumberFieldDescription>Your investement capital</NumberFieldDescription>
          </NumberField>

          { /* FIX: add step 0.001 for commission  */}
          <NumberField
            class="my-4"
            defaultValue={backtestingOptions.commissionPercentage}
            onRawValueChange={(value) => setBacktestingOptions({ ...backtestingOptions, commissionPercentage: value })}
            minValue={0}>
            <NumberFieldLabel>Commission</NumberFieldLabel>
            <div class="relative">
              <NumberFieldInput />
              <NumberFieldIncrementTrigger />
              <NumberFieldDecrementTrigger />
            </div>
            <NumberFieldDescription>Commission taken on every open/close position</NumberFieldDescription>
          </NumberField>

          <Button
            onClick={() => {
              // console.log(strategyCode);

              // HACK: make indicators globally accessible as Indicators.*
              const windowObject = (window as any);
              windowObject.initStrategy = null;
              windowObject.onTick = null;
              windowObject.Indicators = Indicators;

              try {
                // HACK: Jesus Christ, it takes string input, declares global variable via window.VARIABLE_NAME - therefore evaluated result can be assigned to local variable - then it can be passed in rest of the code
                eval(strategyCode.value);
              }
              catch (e: unknown) {
                if (e instanceof Error) {
                  console.error(e);
                  showToast({ title: `JS Evaluation error`, variant: "destructive", description: `${e.name}: ${e.message}` })
                  return;
                }
              }

              const strategy: Strategy = {
                initStrategy: windowObject.initStrategy,
                onTick: windowObject.onTick
              };

              const valueSymbol = selectedMarketData().valueSymbol;
              const baseSymbol = selectedMarketData().baseSymbol;
              const data = selectedMarketData().value;
              const importedData = new MarketData(data, valueSymbol, baseSymbol);

              // TODO: move below part to separated function/class
              const initialBalance = backtestingOptions.initialBalance;
              const commissionPercentage = backtestingOptions.commissionPercentage;
              const broker = new Broker(importedData, initialBalance, commissionPercentage);

              try {
                const backtestingResult = runBacktesting(strategy, broker);
                console.log(backtestingResult);
                props.setBacktestingReport(backtestingResult);
              } catch (e) {
                if (e instanceof Error) {
                  console.error(e);
                  showToast({ title: `Backtesting error`, variant: "destructive", description: `${e.name}: ${e.message}` })
                  return;
                }
              }
            }
            }
          >Run
          </Button>

        </div>
      </div>

    </div >
  );
}
