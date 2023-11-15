import psutil
import requests
import json


def find_chrome_processes():
    chrome_processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        if 'chrome' in proc.info['name'].lower():
            chrome_processes.append(proc)
    return chrome_processes


def find_chrome_debugging_port(process):
    try:
        # Use process.info['pid'] to get the process ID
        response = requests.get(f'http://localhost:9222/json', params={'pid': process.info['pid']}, timeout=1)
        if response.status_code == 200:
            return 9222  # Assuming the default debugging port
    except requests.exceptions.RequestException:
        pass
    return None


def fill_text_field(websocket_url, div_selector, text_field_selector):
    response = requests.get(websocket_url)
    tabs = response.json()

    target_id = tabs[0]['url']

    # Construct the URL for the specific Chrome tab
    tab_url = f"{websocket_url}/session/{target_id}"

    # Fetch the current state of the tab
    response = requests.get(target_id)
    tab_info = response.json()

    # Find the frame ID of the main frame
    main_frame_id = tab_info['targetInfo']['targetId']

    data_to_fill = "my email"

    # Evaluate JavaScript to set the value of the text field
    command = {
        "id": 1,
        "method": "Runtime.evaluate",
        "params": {
            "expression": f'document.querySelector("{text_field_selector}").value = "{data_to_fill}"',
            "contextId": main_frame_id
        }
    }

if __name__ == "__main__":
    # Replace these with your actual selectors
    div_selector = ".contact-input"
    text_field_selector = "#contact_email"

    # Find Chrome processes
    chrome_processes = find_chrome_processes()

    if chrome_processes:
        for process in chrome_processes:
            port = find_chrome_debugging_port(process)
            if port:
                # Get the Chrome DevTools WebSocket URL
                websocket_url = f'http://localhost:{port}/json'

                # Fill the text field based on the div data
                fill_text_field(websocket_url, div_selector, text_field_selector)
                break  # Stop after finding the first Chrome instance
        else:
            print("No Chrome process with an open debugging port found.")
    else:
        print("No Chrome processes found.")
