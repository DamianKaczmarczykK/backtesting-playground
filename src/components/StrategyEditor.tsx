import { Show, createSignal } from "solid-js";
import { Broker, MarketData, Strategy, runBacktesting } from "./BacktestingEngine";
import Editor from "./Editor";
import { MarketDataSelection, addMarketData, backtestingOptions, marketDatas, selectedMarketData, setBacktestingOptions, setSelectedMarketData, strategyCode } from "./EditorStore";
import { Button } from "./ui/button";
import { NumberField, NumberFieldDecrementTrigger, NumberFieldDescription, NumberFieldIncrementTrigger, NumberFieldInput, NumberFieldLabel } from "./ui/number-field";
import { Callout, CalloutContent, CalloutTitle } from "./ui/callout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import Chart from "./Chart";
import { parseYahooCsv } from "./DataImporter";
import { TextField, TextFieldInput, TextFieldLabel } from "./ui/text-field";

export function StrategyEditor(props: any) {

  const [backtestingError, setBacktestingError] = createSignal<string | null>(null);

  // === Data Importing ===
  const [importedData, setImportedData] = createSignal<MarketDataSelection | null>(null);
  const [dialogOpen, setDialogOpen] = createSignal(false);

  return (
    <div>
      <div class="flex">

        <div class="w-1/3">
          { /**  FIX: add validation error on empty selection and add description */}
          <div>
            <h1>Import market data</h1>
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
          </div>



          <div class="w-full">
            <Button onClick={() => setDialogOpen(true)}>Add</Button>
            <Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
              <DialogTrigger></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import market data</DialogTitle>
                  <DialogDescription><p>Select csv file in [Time, Open, High, Low, Close, AdjClose, Volume] format</p>
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

                    if (selectedFile !== undefined) {
                      const reader = new FileReader();
                      reader.readAsText(selectedFile, "UTF-8");
                      reader.onload = function(evt) {
                        const candleData = parseYahooCsv(evt.target.result);
                        console.log(candleData);
                        setImportedData({
                          label: selectedFile.name,
                          valueSymbol: '',
                          baseSymbol: '',
                          value: candleData,
                          disabled: false
                        });
                      }
                      reader.onerror = function(evt) {
                        // TODO: implement error handling for file upload
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
                  }
                  }
                >Import</Button>

              </DialogContent>
            </Dialog>
          </div>

        </div>


        <div class="w-1/3">
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
              try {
                const importedData = new MarketData(selectedMarketData().value);
                console.log(strategyCode);
                // HACK: Jesus Christ, it's taking string input, declares global variable and assign evaluated result to it - then it can be passed in rest of the code
                eval(strategyCode.value);
                const strategy: Strategy = window['strategy']

                // TODO: move below part to separated function/class
                const broker = new Broker(importedData, backtestingOptions.initialBalance, backtestingOptions.commissionPercentage);
                const valueSymbol = selectedMarketData().valueSymbol;
                const baseSymbol = selectedMarketData().baseSymbol;
                const backtestingResult = runBacktesting(strategy, broker, valueSymbol, baseSymbol);
                console.log(backtestingResult);
                props.setBacktestingReport(backtestingResult);
                setBacktestingError(null);
              }
              catch (e) {
                if (e instanceof Error) {
                  setBacktestingError(`${e.name}: ${e.message}`);
                  console.error(e);
                }
              }
            }
            }
          >Run strategy
          </Button>

        </div>


        <div class="ml-8 grow">
          <Show when={backtestingError()}>
            <Callout variant="error" class="my-4">
              <CalloutTitle>Error in strategy</CalloutTitle>
              <CalloutContent>
                {backtestingError()}
              </CalloutContent>
            </Callout>
          </Show>
        </div>
      </div>


      <Editor />

    </div >
  );
}
