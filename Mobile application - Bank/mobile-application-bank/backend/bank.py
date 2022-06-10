from crypt import methods
import re
from flask import Flask, request
from flask_login import user_accessed
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_bcrypt import Bcrypt, bcrypt
import random
from phonenumbers import expected_cost
import requests
from flask import jsonify
from dataclasses import dataclass, field

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///Bank.db'
db = SQLAlchemy(app)
app.config['SECRET_KEY']='405ccfeb07e3f35cdc0e3f1a'

bcrypt = Bcrypt(app)

class User(db.Model):#Creating the user database
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(length=30), nullable=False)
    accountNo = db.Column(db.String(length=10), nullable=False, unique=True)
    email = db.Column(db.String(length=500), nullable=False, unique=True)
    phoneNumber = db.Column(db.String(length=13), nullable=False, unique=True)
    amount = db.Column(db.Integer(), nullable=False, default=0)
    loanAmount = db.Column(db.Integer(), nullable=False, default=0)
    password_hash = db.Column(db.String(length=60), nullable=False)
    currencies = db.relationship('Currencies', backref='currencies', uselist=False)

    @property #creating a new property
    def password(self):
        return self.password
    
    @password.setter #setting the new password property. This field is the one to be used in assigning the password_hash field
    def password(self, plain_text_password):
        self.password_hash = bcrypt.generate_password_hash(plain_text_password).decode('utf-8')

    def check_password_correction(self, attempted_password): #unhashing the passwords to be used during login
        return bcrypt.check_password_hash(self.password_hash, attempted_password)  #returns true or false

    @property
    def checkLoanLimit(self):#checking the loan limits
        limit = 0
        if self.amount < 2000:
            limit = 0
        elif self.amount > 2000 and self.amount < 5000:
            limit = 3000
        elif self.amount > 5000 and self.amount < 10000:
            limit = 7500
        elif self.amount > 10000 and self.amount < 20000:
            limit = 17000
        elif self.amount > 20000 and self.amount < 50000:
            limit = 35000
        else:
            limit = 60000
        return limit
    
    @property
    def change_money(self): # this function is used to put the budget in money format
        x = list(str(self.amount))
        x.reverse()

        t=0
        while t < len(x):
            if (t+1)%4==0:
                x.insert(t, ',')
            t=t+1
        x.reverse()
        p=''
        for c in range(len(x)):
            p+=x[c]
        return p

class Currencies(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    accountNo = db.Column(db.String(length=10), db.ForeignKey('user.accountNo'), nullable=False, unique=True)
    USD = db.Column(db.Float(), default=0, nullable=False) #united states dollar
    EUR = db.Column(db.Float(), default=0, nullable=False) #EUROS
    KES = db.Column(db.Float(), default=0, nullable=False) #Kenyan Shillings
    CAD = db.Column(db.Float(), default=0, nullable=False) #Canandian Dollar
    ZAR = db.Column(db.Float(), default=0, nullable=False) #South African rand
    INR = db.Column(db.Float(), default=0, nullable=False) #Indian rupee
    JPY = db.Column(db.Float(), default=0, nullable=False) #Japanese Yen
    EGP = db.Column(db.Float(), default=0, nullable=False) #Egyptian Pound
    CNY = db.Column(db.Float(), default=0, nullable=False) #China Yuan
    AUD = db.Column(db.Float(), default=0, nullable=False) #Australian Dollar
    GBP = db.Column(db.Float(), default=0, nullable=False) #British Pound
    SGD = db.Column(db.Float(), default=0, nullable=False) #Singapore Dollar
    CHF = db.Column(db.Float(), default=0, nullable=False) #Swiss Franc
    NGN = db.Column(db.Float(), default=0, nullable=False) #Nigerian Naira
    ILS = db.Column(db.Float(), default=0, nullable=False) #Israel Shekel

    @property
    def get_currencies(self):
        data = {'USD': self.USD, 'EUR':self.EUR, 'KES': self.KES, 'CAD':self.CAD, 'ZAR': self.ZAR,
                'INR': self.INR, 'JPY':self.JPY, 'EGP': self.EGP, 'CNY': self.CNY, 'AUD': self.AUD, 'GBP': self.GBP,
                'SGD': self.SGD, 'CHF': self.CHF, 'NGN': self.NGN, 'ILS': self.ILS}
        return data
    
    @property
    def get_owned_currencies(self):
        userCurrencies = self.get_currencies
        ownedCurrencies = {}
        for key in userCurrencies:
            if userCurrencies[key]>0:
                ownedCurrencies[key]=userCurrencies[key]
        
        return ownedCurrencies

@app.route('/login', methods=['POST'])
def login_page():

    userName = request.json['userName']['userName']
    accountNo = request.json['accountNo']['accountNo']
    password = request.json['password']['password']

    attemptingUser = User.query.filter_by(name=userName, accountNo=accountNo).first()
    userData = Currencies.query.filter_by(accountNo=accountNo).first()

    response = {'message': 'Invalid login details', 'success':'false', 'accountNo': '', 
                    'balance': '', 'userName': '', 'loanAmount':'', 'loanLimit': '', 'currencies': str(userData.get_owned_currencies)}

    userCurrencies = userData.get_currencies

    ownedCurrencies = {}
    for key in userCurrencies:
        if userCurrencies[key]>0:
            ownedCurrencies[key]=userCurrencies[key]

    if attemptingUser and attemptingUser.check_password_correction(attempted_password=password):
        print(attemptingUser.email)
        response['message']='Successful Login'
        response['success']='true'
        response['userName']=attemptingUser.name
        response['balance']=str(attemptingUser.amount)
        response['loanAmount']=str(attemptingUser.loanAmount)
        response['loanLimit']=str(attemptingUser.checkLoanLimit)
        response['currencies']=str(ownedCurrencies)


    print(userName)
    print(accountNo)
    print(password)
    
    return jsonify(response)

@app.route('/register', methods=['POST'])
def register_page():
    response = {'message': 'Invalid login details', 'success': 'false', 'accountNo': '', 
                    'balance': '', 'userName': '', 'loanAmount':'', 'loanLimit': '', 'currencies': {'KES':0}}

    userName = request.json['userName']['userName']
    phoneNumber = request.json['phoneNumber']['phoneNumber']
    password = request.json['password']['password']
    email = request.json['email']['email']

    #validations
    similarUser=False
    #check if phoneNumber exists:
    phoneNumberExists = User.query.filter_by(phoneNumber = phoneNumber.strip()).first()
    if phoneNumberExists:
        print('phoneNumber exists')
        response['message']='The phone number exists'
        similarUser=True
    
    emailExists = User.query.filter_by(email=email.strip()).first()#if email exists
    if emailExists:
        print('email exists')
        response['message']='The email already exists.'
        similarUser=True
    
    userNameExists = User.query.filter_by(name=userName.strip()).first()#if userName exists
    if userNameExists:
        print('userName exists')
        response['message']='The User name already exists'
        similarUser=True

    if not similarUser:
        try:
            accountNumber = random.randint(1000000000, 9999999999)#generate an account Number
            newUser = User(name=userName, accountNo=accountNumber, email=email, 
                                    phoneNumber=phoneNumber, password=password)
            newCurrency = Currencies(accountNo=accountNumber)
            db.session.add(newUser)
            db.session.add(newCurrency)
            db.session.commit()

            userCurrencies = newCurrency.get_currencies

            ownedCurrencies = {}
            for key in userCurrencies:
                if userCurrencies[key]>0:
                    ownedCurrencies[key]=userCurrencies[key]

            response['message']='Account created successfully'
            response['success']='true'
            response['accountNo']=str(accountNumber)
            response['balance']=str(newUser.amount)
            response['userName']=str(newUser.name)
            response['loanAmount']=str(newUser.loanAmount)
            response['loanLimit']=str(newUser.checkLoanLimit)
            response['currencies']=str(ownedCurrencies)
            
        except AssertionError as error:
            print(error)
            response['message']='An Error occurred. Try again later or contact the bank'

    print(userName)
    print(phoneNumber)
    print(password)
    print(email)

    return jsonify(response)

@app.route('/transfer', methods=['POST'])
def transfer():
    transferAmount = request.json['transferAmount']['transferAmount']
    receiverId=request.json['receiverId']['receiverId']
    accountNo = request.json['accountNo']['accountNo']

    user  = User.query.filter_by(accountNo=accountNo).first()
    receiver = User.query.filter_by(accountNo=receiverId).first()
    userData = Currencies.query.filter_by(accountNo=accountNo).first()
    receiverData = Currencies.query.filter_by(accountNo=receiverId).first()

    response = {'message': 'An error occured', 'success': 'false', 'balance': str(user.amount), 'currencies': str(userData.get_owned_currencies)}


    try:#Making sure the transfer amount is numeric
        transferAmount=int(transferAmount)
    except:
        response['message']='Please make sure the transfer Amount is a valid number'
        return jsonify(response)
    

    if(not user):
        response['message']='The sender account Number does not exist'
    else:
        if(not receiver):
            response['message']='The receiver account Number does not exist'
        else:
            if transferAmount<=0:
                response['message']='The transfer amount must be greater than 1'
            else:
                if user.amount<transferAmount:
                    response['message']='You have insufficient balance in your account'
                else:
                    if userData.KES<transferAmount:
                        response['message']='Your Kenyan Shillings currency is insuffiecient. Please convert the other currencies you own to KES for transfer'
                    else:
                        user.amount-=transferAmount
                        userData.KES-=transferAmount
                        receiver.amount+=transferAmount
                        receiverData.KES+=transferAmount

                        response['message']=f'Successfully transferred {transferAmount} to {receiver.name} account number {receiverId}'
                        response['success']='true'
                        response['balance']=str(user.amount)
                        response['currencies']=str(userData.get_owned_currencies)

                        db.session.commit()
    
    print(transferAmount)
    print(accountNo)
    print(receiverId)

    return jsonify(response)

@app.route('/withdraw', methods=['POST'])
def withdraw():
    withdrawalAmount = request.json['withdrawalAmount']['withdrawalAmount']
    accountNo = request.json['accountNo']['accountNo']

    user  = User.query.filter_by(accountNo=accountNo).first()
    userData = Currencies.query.filter_by(accountNo=accountNo).first()
    response = {'message': 'An error occured', 'success': 'false', 'balance': str(user.amount), 'currencies': str(userData.get_owned_currencies)}

    try:#Making sure the withdrawal amount is numeric
        withdrawalAmount=int(withdrawalAmount)
    except:
        response['message']='Please make sure the withdrawal Amount is a valid number'
        return jsonify(response)
    
    if(not user):
        response['message']='The account Number does not exist'
    else:
        if withdrawalAmount<=0:
            response['message']='The deposit amount must be greater than 1'
        else:
            if user.amount<withdrawalAmount:
                response['message']='You have insufficient balance in your account'
            else:
                if userData.KES<withdrawalAmount:
                    response['message']='Your Kenyan Shillings currency is insuffiecient. Please convert the other currencies you own to KES for withdrawal'
                else:
                    user.amount-=withdrawalAmount
                    userData.KES-=withdrawalAmount

                    response['message']=f'Successfully withdrawn {withdrawalAmount}'
                    response['success']='true'
                    response['balance']=str(user.amount)
                    response['currencies']=str(userData.get_owned_currencies)

                    db.session.commit()

    print(withdrawalAmount)
    print(accountNo)

    return jsonify(response)

@app.route('/deposit', methods=['POST'])
def deposit():
    depositAmount = request.json['depositAmount']['depositAmount']
    accountNo = request.json['accountNo']['accountNo']

    user  = User.query.filter_by(accountNo=accountNo).first()
    userData = Currencies.query.filter_by(accountNo=accountNo).first()
    response = {'message': 'An error occured', 'success': 'false', 'balance': str(user.amount), 'currencies': str(userData.get_owned_currencies)}


    try:#Making sure the deposit amount is numeric
        depositAmount=int(depositAmount)
    except:
        response['message']='Please make sure the deposit Amount is a valid number'
        return jsonify(response)

    if(not user):
        response['message']='The account Number does not exist'
    else:
        if depositAmount<=0:
            response['message']='The deposit amount must be greater than 1'
        else:
            user.amount+=depositAmount
            userData.KES+=depositAmount
            print(f'{user.amount} Ianooo')

            response['message']=f'Successfully deposited {depositAmount}'
            response['success']='true'
            response['balance']=str(user.amount)
            response['currencies']=str(userData.get_owned_currencies)

            db.session.commit()
    
    print(depositAmount)
    print(accountNo)

    return jsonify(response)

@app.route('/loans', methods=['POST'])
def loans():
    borrowAmount = request.json['borrowAmount']['borrowAmount']
    repayAmount = request.json['repayAmount']['repayAmount']
    accountNo = request.json['accountNo']['accountNo']

    user = User.query.filter_by(accountNo=accountNo).first()
    userData = Currencies.query.filter_by(accountNo=accountNo).first()

    response = {'message': 'Invalid login details', 'success': 'false', 
                    'balance': str(user.amount), 'loanAmount':str(user.loanAmount), 'loanLimit': str(user.checkLoanLimit), 'currencies': str(userData.get_owned_currencies)}

    if borrowAmount !='':
        try:
            borrowAmount = int(borrowAmount)
        except:
            response['message']='The borrow amount must be a numeral'
            return jsonify(response)
        
        if(not user):
            response['message']='Your details do not exist'
        else:
            if user.loanAmount>0:
                response['message']='You have an outstanding loan balance that has to be repaid'
            else:
                if(borrowAmount<=0):
                    response['message']='Please enter a valid borrow amount. Must be greater than 1'
                else:
                    if(borrowAmount>user.checkLoanLimit):
                        response['message']='You can only borrow within your loan limit'
                    else:
                        user.loanAmount+=borrowAmount
                        user.amount +=borrowAmount
                        userData.KES+=borrowAmount
                        response['message']=f'You have successully borrowed {borrowAmount}. The money has been deposited in your bank account'
                        response['success']='true'
                        response['loanAmount']=str(user.loanAmount)
                        response['loanLimit']=str(user.checkLoanLimit)
                        response['balance']=str(user.amount)
                        response['currencies']=str(userData.get_owned_currencies)

                        db.session.commit()
    else:
        try:
            repayAmount = int(repayAmount)
        except:
            response['message']='The repay amount must be a numeral'
            return jsonify(response)
        
        if not user:
            response['message']='Your details do not exist'
        else:
            if user.loanAmount==0:
                response['message']='You have no outstanding loans'
            else:
                if repayAmount<=0:
                    response['message']='Please enter a valid repay amount. Must be greater than 1'
                else:
                    if user.amount<repayAmount:
                        response['message']='You have insufficient balance in your account. Please top up'
                    else:
                        if userData.KES<repayAmount:
                            response['message']='Please first convert enough of your currencies to KES to have enough money to repay'
                        else:
                            if repayAmount>user.loanAmount:
                                user.amount-=user.loanAmount
                                userData.KES-=user.loanAmount
                                user.loanAmount=0
                            else:
                                user.amount-=repayAmount
                                user.loanAmount-=repayAmount
                                userData.KES-=repayAmount
                            response['message']=f'You have successully repayed {repayAmount}. Your outstanding loan balance is {user.loanAmount}'
                            response['success']='true'
                            response['loanAmount']=str(user.loanAmount)
                            response['loanLimit']=str(user.checkLoanLimit)
                            response['balance']=str(user.amount)
                            response['currencies']=str(userData.get_owned_currencies)

                            db.session.commit()


    print(borrowAmount)
    print(repayAmount)
    print(accountNo)

    return jsonify(response)

@app.route('/currencies', methods=['POST'])
def changeCurrency():
    amount = request.json['amount']['amount']
    fromCurrency = request.json['fromCurrency']['fromCurrency']
    toCurrency = request.json['toCurrency']['toCurrency']

    response = {'message': 'Invalid login details', 'success': 'false', 'result':'0'}

    try:
        amount = float(amount)
    except:
        response['message']='Please enter a valid amount'
        return jsonify(response)

    try:
        API_KEY= "61N7X1H7ILJI7SDI"
        url = 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency={}&to_currency={}&apikey={}'.format(
                fromCurrency, toCurrency, API_KEY)
        response = requests.get(url=url).json()
        print(response)
        rate = response['Realtime Currency Exchange Rate']['5. Exchange Rate']
        rate = float(rate)
        result = rate * amount
        print(result)
        response['message']= 'Successful request made'
        response['success']='true'
        response['result']=str(result)
    except AssertionError as error:
        response['message']='A network server Error occurred'
        print(error)

    print(amount)
    print(fromCurrency)
    print(toCurrency)

    return jsonify(response)

@app.route('/trade', methods=['POST'])
def trade():
    accountNo = request.json['accountNo']['accountNo']
    fromCurrency = request.json['fromCurrency']['fromCurrency']
    toCurrency = request.json['toCurrency']['toCurrency']
    amount = request.json['amount']['amount']
    userData = Currencies.query.filter_by(accountNo=accountNo).first()

    response = {'message': 'Invalid login details', 'success': 'false', 'result':'0', 'currencies': str(userData.get_owned_currencies)}

    userCurrencies = userData.get_currencies

    print(userCurrencies)

    ownedCurrencies = {}
    for key in userCurrencies:
        if userCurrencies[key]>0:
            ownedCurrencies[key]=userCurrencies[key]
    
    #checking if the user owns the currency
    owns = False
    ownedAmount = 0
    for key in ownedCurrencies:
        if key==fromCurrency:
            owns=True
            ownedAmount = userCurrencies[key]
    
    try:
        amount=float(amount)
    except:
        response['message']='Please enter a valid amount'
        return jsonify(response)
    if(not owns):
        response['message']='You do not own the currency'
    else:
        if(amount>ownedAmount):
            response['message']='Insufficient balance for the select currency'
        else:
            API_KEY= "61N7X1H7ILJI7SDI"
            url = 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency={}&to_currency={}&apikey={}'.format(
                    fromCurrency, toCurrency, API_KEY)
            response = requests.get(url=url).json()
            print(response)
            rate = response['Realtime Currency Exchange Rate']['5. Exchange Rate']
            rate = float(rate)
            result = rate * amount
            print(result)

            newAmountFromCurrency = getattr(userData, fromCurrency)-amount
            newAmountToCurrency = getattr(userData, toCurrency)+result

            setattr(userData, fromCurrency, newAmountFromCurrency)
            setattr(userData, toCurrency, newAmountToCurrency)

            response['message'] = 'Success'
            response['success'] = 'true'
            response['currencies']=str(userData.get_owned_currencies)

            db.session.commit()

    return jsonify(response)

if __name__ == '__main__':
    app.run(host='192.168.0.108', debug=True)