var serucity = require( "https" ),
	fs = require( "fs" ),
	website = __dirname + "/public/" + ( process.argv[ 2 ] || "my_website.jpg" ) ;

var ssh_dont_look = {
	// really dont look
    key: "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAnoYSlcpv4dIPrx6spTPC+JflaQYNe4EM4PyduQtTkXZ7W8hQ\nXa2H3M92KmABRGkVc/a4jk03tyscSv4DuokArWhH96ivPzV+ATKvtpkdONVp77L7\nR6wASfP5mFJ9Bvif+snj+xIMRpPTvxN1/XexqSZxcoQ8+xIngTDtgTk09IvBeINJ\nxvjIys3DRiZ94ddrzPFSl4b3aO040xnDIZcLflvaOupShyHLfOF6YTv3jUNmZ/wx\n2F0kCdd8zgGTrVvN9HrUweZf61s9wRieqPfmv1TL9fhIyi9aF4I1pFk6qLWCetfy\nG2OMjFtmyT+4qEb6QCzU64e3BjruNjiWCzsqcwIDAQABAoIBAGjEcSoAJZtYSjdR\njYaNRBEpyltzvZtfOdTD/7VZL/zWEkchh0OyOTWNAyqUUqIU1THT4Dtj+yuaWVOS\nt4Ijo4f3gIDEQjYDM2i1R/3lCbQTD7V0U7AVlAdMMCwkcC8YSBrmLT80uVo3vtzs\njrFa1tbU6mtlzCue3u76GC2sUjw/yrAFF+8U93CHQEUVf6wouXiYI6McAxR50BfB\n2BTBMMJ+icifJuf642z7SDdJv6JHSENV/fkugF2b6Ek1cEkkxJyfpxfLrWT+ktGH\nmzPVColE5FivqziW2Pl6/Tpbvdp/ZKsmlCJr5FB4wGbexJcQvNro946Gkh7HhaTu\nPXdJbukCgYEA0nuRHDhJPgktz9JQCrufIZyZ3+ZJ9XdGEvD81zK/mvtrFIYgle0w\nbioXjwUevEJ54uQk/onUVNxtgD5tsN0VTBUnD8hqqnQIGjG/ny67LVDNYDh1BRwS\nHIDitq+BZkIx+YEXPgBa3PEsX5GOiKl4ZaPn7zTVhjN4uf9mc1DoPc0CgYEAwM4H\nr7j2v4uzFZhjroursZ6+2CZhQV9H50OwcR8s/Y4G26mip1KobU/dYyTT8TpZxGuK\ni7bpEd7VL2/85PGdtLM3Qk8ppxmGnsNT4xG3EBnaZnDrP2xOg0bYAfKxHWk4Julu\nt8CaiL+moJEayv+PwjY1UIfUyuy+Pc9gZfHGyT8CgYAslZQFQD7zbwpPLSNbQqbQ\nfdVyQduErUEgnf9QriU79OmXrVmVqGpLy4q19sWt5v7eeqkDabqaRx7CvXaKsini\ntdBSXYeKl41nzwXh+AoZ7TWzngHblTiY5Qwg2kg0muzvBtMfhP+6MTPPAowIkq04\nCmIEn1JjXN/Dtj/DSW4IOQKBgQC0pJTJDDiLsL0Cn7vNfulHyt8uL49xq273/BCl\nfDsv+VDtoFtX//b0LB7V1FyLKEuQ3914F9D5QFlnT7qXWtWSx1Mf2oHBIQZjW8kN\n97wX5tEcp/GRg81v7AFYmeVeFAZbVty4Z0milEXvLOT4i0dLBHUhVZKG6hc4XEMK\nYOQKCwKBgQCZHUUQfAACGwXTF9aHl0xTyTKvwGOwGKD6GiZjo7OhC6knvaiMeImn\nR9v3zhCPp6x5Jxdc8X0hZlVvnp7mmwNLBEcitATCYIwcmBG+01AK9Q9UxmCmaZU8\npCH5642EvI0/ACVQllH8DxgC1eJdtZOnj5T6maSGwSe6E9286PePBQ==\n-----END RSA PRIVATE KEY-----",    cert: "MIIDdjCCAl4CCQCuHMpd43D2rTANBgkqhkiG9w0BAQUFADB9MQswCQYDVQQGEwJVUzEPMA0GA1UECBMGU2VjcmV0MRUwEwYDVQQHEwxOdW55YSBCaXpuaXoxITAfBgNVBAoTGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDEUMBIGA1UECxMLZWcsIHNlY3Rpb24xDTALBgNVBAMTBEZVRE4wHhcNMTQwMTIzMTk1MDIwWhcNMTUwMTIzMTk1MDIwWjB9MQswCQYDVQQGEwJVUzEPMA0GA1UECBMGU2VjcmV0MRUwEwYDVQQHEwxOdW55YSBCaXpuaXoxITAfBgNVBAoTGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDEUMBIGA1UECxMLZWcsIHNlY3Rpb24xDTALBgNVBAMTBEZVRE4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCehhKVym/h0g+vHqylM8L4l+VpBg17gQzg/J25C1ORdntbyFBdrYfcz3YqYAFEaRVz9riOTTe3KxxK/gO6iQCtaEf3qK8/NX4BMq+2mR041WnvsvtHrABJ8/mYUn0G+J/6yeP7EgxGk9O/E3X9d7GpJnFyhDz7EieBMO2BOTT0i8F4g0nG+MjKzcNGJn3h12vM8VKXhvdo7TjTGcMhlwt+W9o66lKHIct84XphO/eNQ2Zn/DHYXSQJ13zOAZOtW830etTB5l/rWz3BGJ6o9+a/VMv1+EjKL1oXgjWkWTqotYJ61/IbY4yMW2bJP7ioRvpALNTrh7cGOu42OJYLOypzAgMBAAEwDQYJKoZIhvcNAQEFBQADggEBADDiMNs+ArYkEhfj+uZXLS4vhrMCQceztHBQSuIoX93ffSRiKE0x+FTs7gaq8n6M+iRVkpIXyBn32k55QqevZQEzDCSOD4I19x2BA/Ooq51UlTCPLQFTsSntPLVHJN7LHjUx+1MaurgvZeNzrYGXspKh/ilv7V/8NMTdwoSuZtit+kqoj5o5Zt/kmxQwByDDfgD1Krx/Q1NcnVP6233BlvQiKGI+dgzsTlzeUpvKdjauPo9d4cio6kd7eXifb/7v5UEDAwynTQgQVHhDmK7FS0iLaGFDDQMCQzKFU01UGjET+MXZe0rtaNxebJ30tF8phoQX5Dl4RkA3EtsTTxb36Ss=",
    cert: "-----BEGIN CERTIFICATE-----\nMIIDdjCCAl4CCQChw/9rD2MAEjANBgkqhkiG9w0BAQUFADB9MQswCQYDVQQGEwJV\nUzEPMA0GA1UECBMGU2VjcmV0MRUwEwYDVQQHEwxOdW55YSBCaXpuaXoxITAfBgNV\nBAoTGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDEUMBIGA1UECxMLZWcsIHNlY3Rp\nb24xDTALBgNVBAMTBEZVRE4wHhcNMTQwMTIzMTk1MjAzWhcNMTUwMTIzMTk1MjAz\nWjB9MQswCQYDVQQGEwJVUzEPMA0GA1UECBMGU2VjcmV0MRUwEwYDVQQHEwxOdW55\nYSBCaXpuaXoxITAfBgNVBAoTGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDEUMBIG\nA1UECxMLZWcsIHNlY3Rpb24xDTALBgNVBAMTBEZVRE4wggEiMA0GCSqGSIb3DQEB\nAQUAA4IBDwAwggEKAoIBAQCehhKVym/h0g+vHqylM8L4l+VpBg17gQzg/J25C1OR\ndntbyFBdrYfcz3YqYAFEaRVz9riOTTe3KxxK/gO6iQCtaEf3qK8/NX4BMq+2mR04\n1WnvsvtHrABJ8/mYUn0G+J/6yeP7EgxGk9O/E3X9d7GpJnFyhDz7EieBMO2BOTT0\ni8F4g0nG+MjKzcNGJn3h12vM8VKXhvdo7TjTGcMhlwt+W9o66lKHIct84XphO/eN\nQ2Zn/DHYXSQJ13zOAZOtW830etTB5l/rWz3BGJ6o9+a/VMv1+EjKL1oXgjWkWTqo\ntYJ61/IbY4yMW2bJP7ioRvpALNTrh7cGOu42OJYLOypzAgMBAAEwDQYJKoZIhvcN\nAQEFBQADggEBAEP7Ol3hTZWB0jLNX1x1WCLsN/xsL9TSIWf5GQ+9dBzdcWdGyD9a\nOTqxFw9vBmUwICqVqXQuUW+b0ruoY5H9mv7QqpkgjBmQc3+WIPdlTxUbQTPcGR9/\nKdZrhT93WEAiFatBw+3nhys/uUfnbAxRLRUigrN1pZ1yWFf21swSoApPkpvtv+wK\nKELhngXGIs/63L8HaIHpmhhGHtL8dGv7VhqGYryy8K9Nq/RmhQCeMjuH7D9HtpnE\nnOzR1DB4EFvxzDK/ptLnaJAIIX7Iykvklyxc7ZVyud+zEL2oNTGDeEpzdfK9vYUz\nnXt9fgdHn1JfNXqOf9iHXmqC9TyQTha8kaw=\n-----END CERTIFICATE-----"
};

serucity.createServer( ssh_dont_look,  function( req, res ) {

	fs.readFile( website , function( err, img ) {
		if ( err ) {
			console.log( "ERROR no secure website here or image **stolen**" );
		}
		res.end( img );
	});

}).listen( 443 );
