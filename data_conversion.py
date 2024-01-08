import pandas

excel_data_df = pandas.read_excel('Betterment_List_v5_dummy.xlsx', 'Betterments UniFormat')

for indicator in range(len(excel_data_df['Indicator area'])):
    excel_data_df['Indicator area'][indicator] = excel_data_df['Indicator area'][indicator].strip()

indicator_order = pandas.api.types.CategoricalDtype(
    ['Energy', 'Carbon', 'Water', 'Waste', 'H&W', 'Habitat & Biodiversity'], 
    ordered=True
)

excel_data_df['Indicator area'] = excel_data_df["Indicator area"].astype(indicator_order)

edited_df = \
    excel_data_df[["Prime Responsible Party", "Betterment", "Indicator area", "Title", "Criteria and Requirements", "Key Collaborators"]]\
    .dropna(subset=['Prime Responsible Party', 'Indicator area', 'Title'])\
    .sort_values(by=['Prime Responsible Party', 'Indicator area', 'Betterment'])\
    .reset_index(drop=True)


json_str = edited_df.to_json()

print(json_str)

json_file = open("betterment_list.json", "w")

json_file.write(json_str)

json_file.close()
